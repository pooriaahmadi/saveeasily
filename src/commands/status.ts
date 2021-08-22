import Command from "../classes/command";
import { executeInputs } from "../types";
import Embed from "../classes/embed";
import si from "systeminformation";
import Users from "../databases/users";
const execute = async ({ interaction, client }: executeInputs) => {
	await interaction.reply({
		embeds: [new Embed().data.setTitle("Please wait...")],
	});
	const data = {
		cpu: "brand, speedMax, cores",
		osInfo: "platform",
		mem: "total, free",
	};
	const systemData = await si.get(data);
	const embed = new Embed();
	let totalSeconds = (client.uptime || 1) / 1000;
	let days = Math.floor(totalSeconds / 86400);
	totalSeconds %= 86400;
	let hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	let minutes = Math.floor(totalSeconds / 60);
	let seconds = Math.floor(totalSeconds % 60);
	embed.data
		.setTitle(`${client.user?.username} Stats`)
		.setThumbnail(String(client.user?.avatarURL()))
		.addField("Servers", "**`" + client.guilds.cache.size + "`**", true)
		.addField("Members", "**`" + client.users.cache.size + "`**", true)
		.addField("Channels", "**`" + client.channels.cache.size + "`**", true)
		.addField("Saves", `**\`${await Users.savesCount()}\`**`, true)
		.addField("Users", `**\`${await Users.usersCount()}\`**`, true)
		.addField(
			"Cpu",
			"```brand: " +
				systemData.cpu.brand +
				"\nCores: " +
				systemData.cpu.cores +
				" " +
				systemData.cpu.speedMax +
				"ghz```",
			true
		)
		.addField(
			"Ram",
			"```Total: " +
				Math.ceil(systemData.mem.total / (1024 * 1024 * 1024)) +
				" GB \nFree: " +
				Math.ceil(systemData.mem.free / (1024 * 1024)) +
				" MB \nBot usage: " +
				Math.ceil(process.memoryUsage().heapUsed / (1024 * 1024)) +
				" MB```",
			true
		)
		.addField("Platform", "`" + systemData.osInfo.platform + "`", true)
		.addField(
			"Uptime",
			"`" +
				`${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds` +
				"`",
			true
		);

	interaction.editReply({ embeds: [embed.data] });
};

export default new Command({
	staffRequired: true,
	execute: execute,
	description: "SaveEasily Status",
});
