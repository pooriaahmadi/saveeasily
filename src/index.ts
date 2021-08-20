// modules
import { Client, Intents } from "discord.js";
import Command from "./classes/command";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
// actual app
dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commands: { [key: string]: Command } = {};
fs.readdirSync(path.join(__dirname, "commands"))
	.filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
	.forEach((file) => {
		const command: Command = require(`./commands/${file}`).default;
		console.log(chalk.cyanBright(`Loaded ${file}`));
		commands[file.replace(".js", "").replace(".ts", "")] = command;
	});
const updateStatus = () => {
	client.user?.setActivity(`${client.guilds.cache.size} Guilds!`);
};
client.once("ready", () => {
	console.log(chalk.greenBright(`Logged in as ${client.user?.username}`));
	updateStatus();
	setInterval(updateStatus, 60 * 1000);
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;
	const command = commands[interaction.commandName];
	if (!command) return;
	try {
		await command.run({ interaction: interaction, client: client });
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content:
				"This command occured an error, So please consider waiting until my developers ",
			ephemeral: true,
		});
	}
});

client.login(process.env.TOKEN);
