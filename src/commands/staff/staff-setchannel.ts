import Command from "../../classes/command";
import { executeInputs, optionTypes } from "../../types";
import Option from "../../classes/option";
import fs from "fs";
import path from "path";
import { WebhookClient } from "discord.js";
const execute = async ({ interaction, client }: executeInputs) => {
	const filePath = path.join(__dirname, "..", "..", "database.json");
	const webhook = interaction.options.getString("webhook", true);
	const source = interaction.options.getString("source", true);
	const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
	try {
		await new WebhookClient({ url: webhook }).send({
			content: "This is a test message for testing updated webhook.",
		});
		content[source] = webhook;
		client.database[source] = webhook;
		fs.writeFileSync(filePath, JSON.stringify(content));
		return await interaction.reply({
			content: `Field ${source} has been updated`,
			ephemeral: true,
		});
	} catch (error) {
		return await interaction.reply({
			content: `Entered webhook is unable to reach.`,
			ephemeral: true,
		});
	}
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
			type: optionTypes.STRING,
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
			type: optionTypes.STRING,
			name: "webhook",
			description: "Target webhook",
			required: true,
		}),
	],
});
