import Command from "../../classes/command";
import Option from "../../classes/option";
import { optionTypes, executeInputs } from "../../types";

const execute = ({ interaction, user, client }: executeInputs) => {
	const codes = interaction.options.getString("codes", true);
	eval(codes);
};

export default new Command({
	staffRequired: true,
	description: "Save easily eval command",
	execute: execute,
	options: [
		new Option({
			description: "codes for running",
			name: "codes",
			required: true,
			type: optionTypes.STRING,
		}),
	],
});
