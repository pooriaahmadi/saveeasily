import Command from "../classes/command";
import Option from "../classes/option";
import { optionType } from "../types";
import { CommandInteraction } from "discord.js";
const execute = async (interaction: CommandInteraction) => {
	const username = interaction.options.getString("username");
	await interaction.reply({ content: `Hello ${username}` });
};

export default new Command({
	staffRequired: false,
	execute: execute,
	description: "ping pong",
	options: [
		new Option({
			type: optionType.string,
			description: "a option",
			name: "username",
			required: true,
		}),
	],
});
