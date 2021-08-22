import Command from "../classes/command";
import { executeInputs, userModel } from "../types";
import Embed from "../classes/embed";
import Option from "../classes/option";
import Users from "../databases/users";

const execute = async ({ interaction, client, user }: executeInputs) => {
	const mentionedUser = interaction.options.getUser("user", false);
	let finalUser: userModel | undefined = user;
	if (mentionedUser) {
		finalUser = await Users.getByDiscordId(mentionedUser.id);
		if (!finalUser) {
			return await interaction.reply({
				embeds: [
					new Embed().data.setTitle(
						`${mentionedUser.username} isn't registered yet.`
					),
				],
				ephemeral: true,
			});
		}
	}
	let permissionsString: string = "";
	if (finalUser?.isVip) {
		permissionsString += "<:diamond:878301033300910080> **`Vip`**\n";
	}
	if (finalUser?.isStaff) {
		permissionsString += "<:emerald:878301034227826688> **`Staff`**";
	}
	const embed = new Embed().data
		.setTitle(`${finalUser?.username}#${finalUser?.discriminator} Profile`)
		.addField("Discord id", "**`" + finalUser?.discordId + "`**", true)
		.addField("Id", "**`" + finalUser?.id + "`**", true)
		.addField(
			"Discord",
			"**`" + `${finalUser?.username}#${finalUser?.discriminator}` + "`**",
			true
		)
		.addField("Permissions", permissionsString || "No permissions", true)
		.addField("Used Commands", "**`" + finalUser?.usedCommands + "`**", true)
		.addField("Saves", "**`" + (await finalUser?.savesCount()) + "`**", true)
		.setThumbnail(
			String(
				mentionedUser ? mentionedUser.avatarURL() : interaction.user.avatarURL()
			)
		);
	return await interaction.reply({
		embeds: [embed],
	});
};

export default new Command({
	execute: execute,
	accountRequired: true,
	description: "Your profile in Save Easily",
	options: [
		new Option({
			type: "user",
			description: "Target user to view profile",
			name: "user",
			required: false,
		}),
	],
});
