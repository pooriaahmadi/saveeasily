import {
	commandInterface,
	optionModel,
	CommandModel,
	executeInputs,
	choiceModel,
} from "../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { runAuthenticate } from "./authentication";
class Command implements CommandModel {
	staffRequired;
	accountRequired;
	execute;
	slashCommand;
	description;
	options;
	constructor({
		staffRequired = false,
		accountRequired = false,
		execute,
		description,
		options = [],
	}: commandInterface) {
		this.staffRequired = staffRequired;
		this.accountRequired = accountRequired;
		this.execute = execute;
		this.slashCommand = new SlashCommandBuilder().setDescription(description);
		this.description = description;
		this.options = options; // Bunch of options with Option class
	}
	run = async ({ interaction, client }: executeInputs) => {
		await runAuthenticate({
			staffRequired: this.staffRequired,
			interaction: interaction,
			client: client,
			execute: this.execute,
			accountRequired: this.accountRequired,
		});
	};
	toJSON = (name: string) => {
		this.slashCommand.setName(name);
		const setOption = (data: any, option: optionModel) => {
			data
				.setName(option.name)
				.setDescription(option.description)
				.setRequired(option.required);
			if (option.choices.length) {
				option.choices.forEach((choice: choiceModel) => {
					data.addChoice(choice.displayName, choice.name);
				});
			}
			return data;
		};
		this.options.forEach((option) => {
			switch (option.type) {
				case "string":
					this.slashCommand.addStringOption((data) => setOption(data, option));
					break;
				case "integer":
					this.slashCommand.addIntegerOption((data) => setOption(data, option));
					break;
				case "boolean":
					this.slashCommand.addBooleanOption((data) => setOption(data, option));
					break;
				case "mentionable":
					this.slashCommand.addMentionableOption((data) =>
						setOption(data, option)
					);
					break;
				case "user":
					this.slashCommand.addUserOption((data) => setOption(data, option));
					break;
				case "channel":
					this.slashCommand.addChannelOption((data) => setOption(data, option));
					break;

				default:
					break;
			}
		});
		return this.slashCommand.toJSON();
	};
}

export default Command;
