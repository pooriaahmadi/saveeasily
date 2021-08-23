import Command from "../../classes/command";
import { executeInputs, optionTypes } from "../../types";
import Option from "../../classes/option";
import Users from "../../databases/users";
const execute = async ({ interaction, client }: executeInputs) => {
	const user = interaction.options.getUser("user", true);
	const databaseUser = await Users.getByDiscordId(user.id);
	if (databaseUser) {
		return await interaction.reply({
			content: `${user.username}#${user.discriminator} is already registered!`,
			ephemeral: true,
		});
	} else {
		const result = await Users.create({
			discordId: user.id,
			discriminator: user.discriminator,
			username: user.username,
		});
		return await interaction.reply({
			content: `${result.username}#${result.discriminator} has been registered with id ${user.id}!`,
			ephemeral: true,
		});
	}
};

export default new Command({
	staffRequired: true,
	execute: execute,
	description: "Force registering target user",
	options: [
		new Option({
			type: optionTypes.USER,
			name: "user",
			description: "Target User",
			required: true,
		}),
	],
});
