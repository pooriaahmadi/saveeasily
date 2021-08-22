import Users from "../databases/users";
import { staff } from "../config";
import { Client, CommandInteraction, ContextMenuInteraction } from "discord.js";

export const runAuthenticate = async ({
	staffRequired,
	interaction,
	client,
	execute,
	accountRequired,
}: {
	staffRequired: boolean | undefined;
	accountRequired: boolean | undefined;
	interaction: CommandInteraction | ContextMenuInteraction;
	client: Client;
	execute: any;
}) => {
	if (staffRequired) {
		for (const item of staff) {
			if (interaction.user.id === item) {
				const user = await Users.getByDiscordId(interaction.user.id);
				return execute({
					interaction: interaction,
					client: client,
					user: user,
				});
			}
		}
		return interaction.reply({
			content: "This command is staff only",
			ephemeral: true,
		});
	}
	if (accountRequired) {
		const user = await Users.getByDiscordId(interaction.member?.user.id);
		if (user) {
			if (
				interaction.user.username !== user.username ||
				interaction.user.discriminator !== user.discriminator
			) {
				await user.updateDiscordInformation({
					username: interaction.user.username,
					discriminator: interaction.user.discriminator,
				});
			}
			user.addUsedCommand(1);
			return execute({
				interaction: interaction,
				client: client,
				user: user,
			});
		} else {
			return interaction.reply({
				content: "Please create an account first using /register.",
				ephemeral: true,
			});
		}
	}
	return execute({ interaction: interaction, client: client });
};
