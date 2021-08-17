import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, testGuild } from "../config";
import Command from "../classes/command";
import fs from "fs";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();
const args = process.argv.splice(2);
const commands: Array<Command> = [];
const commandFiles = fs
	.readdirSync("./src/commands")
	.filter((file) => file.endsWith(".js") || file.endsWith(".ts"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`).default;
	commands.push(command.toJSON(file.replace(".js", "").replace(".ts", "")));
}

const rest = new REST({ version: "9" }).setToken(String(process.env.TOKEN));

(async () => {
	try {
		console.log(chalk.blue("Started registering slash commands"));
		if (args[0] === "dev") {
			await rest.put(Routes.applicationGuildCommands(clientId, testGuild), {
				body: commands,
			});
		} else {
			console.log(
				chalk.yellow(
					"You're registering as global mode, So it could take an hour to apply changes"
				)
			);
			await rest.put(Routes.applicationCommands(clientId), {
				body: commands,
			});
		}
		console.log(chalk.greenBright("Successfully registered commands"));
	} catch (error) {
		console.error(error);
	}
})();
