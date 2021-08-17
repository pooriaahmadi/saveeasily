import { commandInterface, optionInterface } from "../types";
import { staff } from "../config";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

class Command {
	staffRequired;
	execute;
	slashCommand;
	description;
	options;
	constructor({
		staffRequired = false,
		execute,
		description,
		options = [],
	}: commandInterface) {
		this.staffRequired = staffRequired;
		this.execute = execute;
		this.slashCommand = new SlashCommandBuilder().setDescription(description);
		this.description = description;
		this.options = options; // Bunch of options with Option class
	}
	run = (interaction: CommandInteraction) => {
		if (this.staffRequired) {
			staff.forEach((item) => {
				if (interaction.member?.user.id === item.toString()) {
					return this.execute(interaction);
				}
			});
		}
		return this.execute(interaction);
	};
	toJSON = (name: string) => {
		this.slashCommand.setName(name);
		const setOption = (data: any, option: optionInterface) => {
			data
				.setName(option.name)
				.setDescription(option.description)
				.setRequired(option.required);
			return data;
		};
		this.options.forEach((option) => {
			switch (option.type) {
				case "string":
					this.slashCommand.addStringOption((data) => setOption(data, option));
					break;
				case "number":
					this.slashCommand.addIntegerOption((data) => setOption(data, option));
					break;
				case "boolean":
					this.slashCommand.addBooleanOption((data) => setOption(data, option));
					break;
				default:
					break;
			}
		});
		return this.slashCommand.toJSON();
	};
}

export default Command;
