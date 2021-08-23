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
		return {
			name: name,
			type: 1,
			description: this.description,
			options: this.options.map((item) => item.toJSON()),
		};
	};
}

export default Command;
