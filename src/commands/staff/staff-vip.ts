import Command from "../../classes/command";
import { executeInputs, optionTypes } from "../../types";
import Option from "../../classes/option";
import Users from "../../databases/users";
const execute = async ({ interaction, client }: executeInputs) => {
	const user = interaction.options.getUser("user", true);
	const days = interaction.options.getInteger("days", true);
	const months = interaction.options.getInteger("months", true);
	const databaseUser = await Users.getByDiscordId(user.id);
	if (databaseUser) {
		if (databaseUser.vip && !databaseUser.vip.isExpired()) {
			await databaseUser.makeNormal();
			return await interaction.reply({
				content: `${user.username}#${user.discriminator} is now a normal user`,
			});
		} else {
			const currentDate = new Date();
			currentDate.setMonth(currentDate.getMonth() + months);
			currentDate.setDate(currentDate.getDate() + days);
			await databaseUser.makeVip(currentDate);
			return await interaction.reply({
				content: `${user.username}#${
					user.discriminator
				} is now a VIP user SHEEEESH\nUntil: **<t:${
					currentDate.getTime() / 1000
				}:d>**`,
			});
		}
	} else {
		return await interaction.reply({
			content: `${user.username}#${user.discriminator} isn't registered yet.`,
			ephemeral: true,
		});
	}
};

export default new Command({
	staffRequired: true,
	execute: execute,
	description: "Vip toggle command",
	options: [
		new Option({
			type: optionTypes.USER,
			name: "user",
			description: "Target User",
			required: true,
		}),
		new Option({
			type: optionTypes.INTEGER,
			name: "days",
			description: "Extra days",
			required: true,
		}),
		new Option({
			type: optionTypes.INTEGER,
			name: "months",
			description: "Extra months",
			required: true,
		}),
	],
});
