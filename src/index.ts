// modules
import { Client, Intents } from "discord.js";
import Command from "./classes/command";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { contextMenuModel } from "./types";
// actual app
dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const commands: { [key: string]: Command } = {};
const contextMenus: { [key: string]: contextMenuModel } = {};
console.log(chalk.yellow("=-=-=-= Slash Commands =-=-=-="));
fs.readdirSync(path.join(__dirname, "commands"))
	.filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
	.forEach((file) => {
		const command: Command = require(`./commands/${file}`).default;
		console.log(chalk.cyanBright(`Loaded Command ${file}`));
		commands[file.replace(".js", "").replace(".ts", "")] = command;
	});
console.log(chalk.yellow("=-=-=-= Context Menus =-=-=-="));
fs.readdirSync(path.join(__dirname, "context-menus"))
	.filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
	.forEach((file) => {
		const contextMenu: contextMenuModel =
			require(`./context-menus/${file}`).default;
		console.log(chalk.cyanBright(`Loaded Context Menu ${file}`));
		contextMenus[contextMenu.name] = contextMenu;
	});
const updateStatus = () => {
	client.user?.setActivity(`${client.guilds.cache.size} Guilds!`, {
		type: "WATCHING",
	});
};
client.once("ready", () => {
	console.log(chalk.greenBright(`Logged in as ${client.user?.username}`));
	updateStatus();
	setInterval(updateStatus, 60 * 1000);
});

client.on("interactionCreate", async (interaction) => {
	try {
		if (interaction.isContextMenu()) {
			const contextMenu = contextMenus[interaction.commandName];
			if (!contextMenu) return;
			await contextMenu.run({ interaction, client });
		}
		if (interaction.isCommand()) {
			const command = commands[interaction.commandName];
			if (!command) return;
			await command.run({ interaction: interaction, client: client });
		}
	} catch (error) {
		console.error(error);
		if (interaction.isContextMenu() || interaction.isCommand()) {
			if (interaction.replied) {
				await interaction.editReply({
					content:
						"This command occurred an error, So please consider waiting until my developers ",
				});
			}
			await interaction.reply({
				content:
					"This command occurred an error, So please consider waiting until my developers ",
				ephemeral: true,
			});
		}
	}
	return;
});

client.login(process.env.TOKEN);
