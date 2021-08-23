import Command from "../../classes/command";
import { executeInputs, optionTypes } from "../../types";
import Option from "../../classes/option";
import Users from "../../databases/users";
const execute = async ({ interaction, client }: executeInputs) => {
	const user = interaction.options.getUser("user", true);
	const databaseUser = await Users.getByDiscordId(user.id);
	if (databaseUser) {
		if (databaseUser.isStaff) {
			await databaseUser.demote();
			return await interaction.reply({
				content: `${user.username}#${user.discriminator} has been demoted`,
			});
		} else {
			await databaseUser.makeStaff();
			return await interaction.reply({
				content: `${user.username}#${user.discriminator} is now one of ${client.user?.username} staff user SHEEEESH`,
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
	description: "Staff toggle command",
	options: [
		new Option({
			type: optionTypes.USER,
			name: "user",
			description: "Target User",
			required: true,
		}),
	],
});
