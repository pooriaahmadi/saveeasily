import Command from "../../classes/command";
import Embed from "../../classes/embed";
import { executeInputs, userModel } from "../../types";
import Users from "../../databases/users";
const execute = async ({ interaction, client }: executeInputs) => {
	const user = await Users.getByDiscordId(interaction.member?.user.id);
	if (user) {
		return await interaction.reply({
			embeds: [new Embed().data.setTitle("You already have an account!")],
			ephemeral: true,
		});
	}
	await Users.create({
		discordId: interaction.member?.user.id,
		username: interaction.member?.user.username,
		discriminator: interaction.member?.user.discriminator,
	});
	await interaction.reply({
		embeds: [new Embed().data.setTitle("Account created!")],
	});
};

export default new Command({
	execute: execute,
	description: "Create account on Save Easily",
});
