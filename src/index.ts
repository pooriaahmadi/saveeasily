// modules
import express from "express";
import { Guild, Intents, Interaction, WebhookClient } from "discord.js";
import Client from "./classes/client";
import Command from "./classes/command";
import chalk from "chalk";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { CategoryModel, contextMenuModel } from "./types";
import channels from "./database.json";

import Embed from "./classes/embed";
import users from "./databases/users";
import Main from "./databases/main";
// actual app
dotenv.config();
const app = express();
app.get("/", (request, response) => {
	response.send("alive");
});
app.listen(process.env.PORT, () => {
	console.log("app is listening.");
});
declare module "discord.js" {
	interface Channel {
		send: (message: any) => Promise<any>;
	}
}

const client = new Client({
	intents: [Intents.FLAGS.GUILDS],
});
client.database = channels;
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
};
client.once("ready", async () => {
	console.log(chalk.greenBright(`Logged in as ${client.user?.username}`));
	updateStatus();
	setInterval(updateStatus, 60 * 1000);
	await new WebhookClient({ url: client.database.logs }).send({
		content: `${client.user?.username} is now ready!`,
	});
	const guilds: any = await Main.createQuery("SELECT * FROM guilds");
	client.guilds.cache.forEach(async (guild) => {
		if (
			!guilds.find((e: { [key: string]: string }) => e.discord_id === guild.id)
		) {
			await Main.createQuery(
				`INSERT INTO guilds (discord_id) VALUES ('${guild.id}');`
			);
		}
	});
});

client.on("interactionCreate", async (interaction: Interaction) => {
	if (!interaction.inGuild()) return;
	try {
		if (interaction.isContextMenu()) {
			const contextMenu: any = client.contextMenus[interaction.commandName];
			if (!contextMenu) return;
			await contextMenu.run({ interaction, client });
		}
		if (interaction.isCommand()) {
			let command;
			let subCommands = "";
			try {
				subCommands = interaction.options.getSubcommand();
				command =
					client.commands[`${interaction.commandName}-${subCommands}`].class;
			} catch (error) {
				subCommands = "";
				command = client.commands[interaction.commandName].class;
			}
			if (!command) return;
			new WebhookClient({
				url: client.database.commands,
			}).send({
				embeds: [
					new Embed().data
						.addField(
							"User",
							`${interaction.user.username}#${interaction.user.discriminator}`,
							true
						)
						.addField("ID", interaction.user.id, true)
						.addField(
							"Server",
							`${interaction.guildId} | ${interaction.guild?.name}`,
							true
						)
						.addField("Channel", `${interaction.channelId}`, true)
						.addField("Command", `${interaction.commandName} ${subCommands}`),
				],
			});
			await command.run({ interaction: interaction, client: client });
		}
	} catch (error) {
		console.error(error);
		new WebhookClient({ url: client.database.errors }).send(String(error));
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

client.on("guildCreate", async (guild: Guild) => {
	updateStatus();
	const user = await users.getByDiscordId(guild.ownerId);
	if (guild.memberCount < 20 && !user?.vip) {
		await guild.leave();
		new WebhookClient({ url: client.database.guilds }).send({
			content: `I left ${guild.name} because it has less member than 20`,
		});
	} else {
		new WebhookClient({ url: client.database.guilds }).send({
			embeds: [
				new Embed().data
					.setTitle("New Server!")
					.setDescription(`Thanks to <@${guild.ownerId}> for adding me :)`)
					.addField("Members Count", `**\`${guild.memberCount}\`**`, true)
					.setThumbnail(guild.iconURL() || "https://discord.com"),
			],
		});
		await Main.createQuery(
			`INSERT INTO guilds (discord_id) VALUES ('${guild.id}');`
		);
	}
});
client.on("guildDelete", async (guild: Guild) => {
	updateStatus();

	new WebhookClient({ url: client.database.guilds }).send({
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
	await Main.createQuery(`DELETE FROM guilds WHERE discord_id='${guild.id}'`);
});

client.login(process.env.TOKEN);
