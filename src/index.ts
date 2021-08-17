// modules
import { Client, Intents } from "discord.js";
import chalk from "chalk";
import dotenv from "dotenv";
// actual app
dotenv.config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
	console.log(chalk.greenBright(`Logged in as ${client.user?.username}`));
});

client.login(process.env.TOKEN);
