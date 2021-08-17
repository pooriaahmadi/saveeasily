import { CommandInteraction } from "discord.js";

export enum optionType {
	string = "string",
	number = "number",
	boolean = "boolean",
}
export interface optionInterface {
	type: optionType;
	name: string;
	description: string;
	required: boolean;
}

export interface commandInterface {
	staffRequired: boolean;
	execute: (Interaction: CommandInteraction) => void;
	description: string;
	options: Array<optionInterface>;
}
