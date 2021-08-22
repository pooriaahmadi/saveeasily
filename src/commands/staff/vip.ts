import Command from "../../classes/command";
import { executeInputs } from "../../types";
import Option from "../../classes/option";
import Users from "../../databases/users";
const execute = async ({ interaction, client }: executeInputs) => {
	const user = interaction.options.getUser("user", true);
	const databaseUser = await Users.getByDiscordId(user.id);
	if (databaseUser) {
		if (databaseUser.isVip) {
			await databaseUser.makeNormal();
			return await interaction.reply({
				content: `${user.username}#${user.discriminator} is now a normal user`,
			});
		} else {
			await databaseUser.makeVip();
			return await interaction.reply({
				content: `${user.username}#${user.discriminator} is now a VIP user SHEEEESH`,
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
			type: "user",
			name: "user",
			description: "Target User",
			required: true,
		}),
	],
});
