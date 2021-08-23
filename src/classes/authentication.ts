import Users from "../databases/users";
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
	const user = await Users.getByDiscordId(interaction.member?.user.id);
	if (user) {
		user.addUsedCommand(1);
		if (staffRequired) {
			if (!user.isStaff) {
				return interaction.reply({
					content: "This command is staff only",
					ephemeral: true,
				});
			}
		}
		if (accountRequired) {
			if (
				interaction.user.username !== user.username ||
				interaction.user.discriminator !== user.discriminator
			) {
				await user.updateDiscordInformation({
					username: interaction.user.username,
					discriminator: interaction.user.discriminator,
				});
			}
		}
		return execute({
			interaction: interaction,
			client: client,
			user: user,
		});
	} else {
		if (accountRequired || staffRequired) {
			return interaction.reply({
				content: "Please create an account first using /register.",
				ephemeral: true,
			});
		}
		return execute({ interaction: interaction, client: client });
	}
};
