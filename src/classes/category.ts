import {
	CategoryInputs,
	CategoryModel,
	CommandModel,
	optionTypes,
} from "../types";
import fs from "fs";
import path from "path";
import Command from "./command";
import Option from "./option";
class Category implements CategoryModel {
	name;
	emoji;
	description;
	constructor({ name, emoji, description }: CategoryInputs) {
		this.name = name;
		this.emoji = emoji;
		this.description = description;
	}
	getCommands = (dirName: string) => {
		return fs
			.readdirSync(path.join(__dirname, `../commands/${dirName}`))
			.filter(
				(file) =>
					(file.endsWith(".js") || file.endsWith(".ts")) &&
					!file.includes("index")
			);
	};
	toJSON = (dirName: string) => {
		const files = fs
			.readdirSync(path.join(__dirname, `../commands/${dirName}`))
			.filter(
				(file) =>
					(file.endsWith(".js") || file.endsWith(".ts")) &&
					!file.includes("index")
			);
		const data: object[] = [];
		const mainCommands: { [key: string]: CommandModel } = {};
		files.forEach((file) => {
			const args = file.split("-");
			const command: CommandModel =
				require(`../commands/${dirName}/${file}`).default;

			if (args.length === 1) {
				data.push(command.toJSON(file.replace(".js", "").replace(".ts", "")));
			} else {
				if (mainCommands[args[0]]) {
					mainCommands[args[0]].options.push(
						new Option({
							description: command.description,
							type: optionTypes.SUB_COMMAND,
							name: args[1].replace(".ts", "").replace(".js", ""),
							options: command.options,
							required: true,
						})
					);
				} else {
					mainCommands[args[0]] = new Command({
						execute: async () => {},
						description: "asd",
						options: [
							new Option({
								description: command.description,
								type: optionTypes.SUB_COMMAND,
								name: args[1].replace(".ts", "").replace(".js", ""),
								options: command.options,

								required: true,
							}),
						],
					});
				}
			}
		});

		return [
			...data,
			...Object.keys(mainCommands).map((key) => {
				return mainCommands[key].toJSON(key);
			}),
		];
	};
}

export default Category;
