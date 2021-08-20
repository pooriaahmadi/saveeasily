import {
	commandInterface,
	optionInterface,
	CommandModel,
	executeInputs,
} from "../types";
import { staff } from "../config";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Users from "../databases/users";
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
		if (this.staffRequired) {
			staff.forEach((item) => {
				if (interaction.member?.user.id === item.toString()) {
					return this.execute({ interaction: interaction, client: client });
				}
			});
			return interaction.reply({
				content: "This command is staff only",
				ephemeral: true,
			});
		}
		if (this.accountRequired) {
			const user = await Users.getByDiscordId(interaction.member?.user.id);
			if (user) {
				return this.execute({
					interaction: interaction,
					client: client,
					user: user,
				});
			} else {
				return interaction.reply({
					content: "Please create an account first using /register.",
					ephemeral: true,
				});
			}
		}
		return this.execute({ interaction: interaction, client: client });
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
