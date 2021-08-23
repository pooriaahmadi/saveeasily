import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, testGuild } from "../config";
import path from "path/posix";
import Command from "../classes/command";
import fs from "fs";
import chalk from "chalk";
import dotenv from "dotenv";
import { contextMenuModel, CategoryModel } from "../types";
dotenv.config();
const args = process.argv.splice(2);
const commands: Array<{ [key: string]: any }> = [];
fs.readdirSync(path.resolve("./src/commands")).forEach((dir) => {
	const category: CategoryModel = require(path.resolve(
		`./src/commands/${dir}`
	)).default;
	commands.push(...category.toJSON(dir));
});

const contextMenus: { [key: string]: string | number }[] = [];
fs.readdirSync(path.resolve("./src/context-menus"))
	.filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
	.forEach((file) => {
		const contextMenu: contextMenuModel = require(path.resolve(
			`./src/context-menus/${file}`
		)).default;
		console.log(chalk.cyanBright(`Loaded Context Menu ${file}`));

		contextMenus.push(contextMenu.toJSON());
	});

const rest = new REST({ version: "9" }).setToken(String(process.env.TOKEN));
const app = async () => {
	try {
		console.log(chalk.blue("Started registering commands"));
		if (args[0] === "dev") {
			await rest.put(Routes.applicationGuildCommands(clientId, testGuild), {
				body: [...commands, ...contextMenus],
			});
		} else {
			console.log(
				chalk.yellow(
					"You're registering as global mode, So it could take an hour to apply changes"
				)
			);
			await rest.put(Routes.applicationCommands(clientId), {
				body: [...commands, ...contextMenus],
			});
		}
		console.log(chalk.greenBright("Successfully registered commands"));
	} catch (error) {
		console.error(error);
	}
};
app().then(() => {
	process.exit(0);
});
