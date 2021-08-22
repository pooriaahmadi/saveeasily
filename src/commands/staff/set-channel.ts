import Command from "../../classes/command";
import { executeInputs } from "../../types";
import Option from "../../classes/option";
import fs from "fs";
import path from "path";
const execute = async ({ interaction, client }: executeInputs) => {
	const filePath = path.join(__dirname, "..", "..", "database.json");
	const channel = interaction.options.getChannel("channel", true);
	const source = interaction.options.getString("source", true);
	const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
	content[source] = channel.id;
	fs.writeFileSync(filePath, JSON.stringify(content));
	return await interaction.reply({
		content: `Field ${source} has been set to ${channel.id}`,
	});
};

export default new Command({
	staffRequired: true,
	execute: execute,
	description: "Sets the logs Channel",
	options: [
		new Option({
			name: "source",
			description: "The name of field",
			required: true,
			type: "string",
		})
			.addChoice({
				name: "logs",
				displayName: "LOGS",
			})
			.addChoice({
				name: "errors",
				displayName: "ERRORS",
			})
			.addChoice({
				name: "guilds",
				displayName: "GUILDS",
			})
			.addChoice({
				name: "commands",
				displayName: "COMMANDS",
			}),
		new Option({
			type: "channel",
			name: "channel",
			description: "Target Channel",
			required: true,
		}),
	],
});
