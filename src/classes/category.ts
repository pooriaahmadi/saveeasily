import { CategoryInputs, CategoryModel } from "../types";
import fs from "fs";
import path from "path";
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
}

export default Category;
