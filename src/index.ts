// modules
import { Intents } from "discord.js";
import Client from "./classes/Client";
import Command from "./classes/command";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { CategoryModel, contextMenuModel } from "./types";
let { commands, errors, guilds, logs } = require("./database.json");

import Embed from "./classes/embed";
// actual app
dotenv.config();
declare module "discord.js" {
	interface Channel {
		send: (message: any) => Promise<any>;
	}
}

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_PRESENCES],
});
console.log(chalk.yellow("=-=-=-= Slash Commands =-=-=-="));
fs.readdirSync(path.join(__dirname, "commands")).forEach((dir) => {
	const category: CategoryModel = require(path.join(
		__dirname,
		"commands",
		dir
	)).default;
	client.categories[dir] = category;
	category.getCommands(dir).forEach((file) => {
		const command: Command = require(`./commands/${dir}/${file}`).default;
		console.log(chalk.cyanBright(`Loaded Command ${file}`));
		client.commands[file.replace(".js", "").replace(".ts", "")] = {
			class: command,
			category: dir,
		};
	});
});

console.log(chalk.yellow("=-=-=-= Context Menus =-=-=-="));
fs.readdirSync(path.join(__dirname, "context-menus"))
	.filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
	.forEach((file) => {
		const contextMenu: contextMenuModel =
			require(`./context-menus/${file}`).default;
		console.log(chalk.cyanBright(`Loaded Context Menu ${file}`));
		client.contextMenus[contextMenu.name] = contextMenu;
	});
const updateStatus = () => {
	client.user?.setActivity(`${client.guilds.cache.size} Guilds!`, {
		type: "WATCHING",
	});
	const database = require("./database.json");
	logs = database.logs;
	commands = database.commands;
	errors = database.errors;
	guilds = database.guilds;
};
client.once("ready", () => {
	console.log(chalk.greenBright(`Logged in as ${client.user?.username}`));
	updateStatus();
	setInterval(updateStatus, 60 * 1000);
});

client.on("interactionCreate", async (interaction) => {
	try {
		if (interaction.isContextMenu()) {
			const contextMenu: any = client.contextMenus[interaction.commandName];
			if (!contextMenu) return;
			await contextMenu.run({ interaction, client });
		}
		if (interaction.isCommand()) {
			const command = client.commands[interaction.commandName].class;
			if (!command) return;
			await client.channels.cache
				.get(commands)
				?.send(
					`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}) runned **\`${interaction.commandName}\`**`
				);
			await command.run({ interaction: interaction, client: client });
		}
	} catch (error) {
		console.error(error);
		await client.channels.cache.get(errors)?.send(String(error));
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

client.on("guildCreate", async (guild) => {
	updateStatus();
	if (guild.memberCount < 20) {
		await guild.leave();
		await client.channels.cache.get(logs)?.send({
			content: `I left ${guild.name} because it has less member than 20`,
		});
	} else {
		await client.channels.cache.get(guilds)?.send({
			embeds: [
				new Embed().data
					.setTitle("New Server!")
					.setDescription(`Thanks to <@${guild.ownerId}> for adding me :)`)
					.addField("Members Count", `**\`${guild.memberCount}\`**`, true)
					.setThumbnail(guild.iconURL() || "https://discord.com"),
			],
		});
	}
});
client.on("guildDelete", async (guild) => {
	updateStatus();

	await client.channels.cache.get(guilds)?.send({
		embeds: [
			new Embed().data
				.setTitle("Leaved a server!")
				.setDescription(
					`Sadge that i left but thanks to <@${guild.ownerId}> for adding me :)`
				)
				.addField("Members Count", `**\`${guild.memberCount}\`**`, true)
				.setThumbnail(guild.iconURL() || "https://discord.com"),
		],
	});
});

client.login(process.env.TOKEN);
