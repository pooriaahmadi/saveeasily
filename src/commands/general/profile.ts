import Command from "../../classes/command";
import { executeInputs, optionTypes, userModel } from "../../types";
import Embed from "../../classes/embed";
import Option from "../../classes/option";
import Users from "../../databases/users";

const execute = async ({ interaction, client, user }: executeInputs) => {
	await interaction.deferReply();
	const mentionedUser = interaction.options.getUser("user", false);
	let finalUser: userModel | undefined = user;
	if (mentionedUser) {
		finalUser = await Users.getByDiscordId(mentionedUser.id);
		if (!finalUser) {
			return await interaction.editReply({
				embeds: [
					new Embed().data.setTitle(
						`${mentionedUser.username} isn't registered yet.`
					),
				],
			});
		}
	}
	let permissionsString: string = "";
	if (finalUser?.vip && !finalUser?.vip.isExpired()) {
		permissionsString += "<:diamond:878301033300910080> **`Vip`**\n";
	}
	if (finalUser?.isStaff) {
		permissionsString += "<:emerald:878301034227826688> **`Staff`**";
	}
	const embed = new Embed(finalUser).data
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
	if (finalUser?.vip && !finalUser?.vip.isExpired()) {
		embed.addField(
			"Vip",
			`Started on: **<t:${
				finalUser.vip.start.getTime() / 1000
			}:d>**\nExpiration: **<t:${finalUser.vip.end.getTime() / 1000}:d>**`,
			true
		);
	}
	return await interaction.editReply({
		embeds: [embed],
	});
};

export default new Command({
	execute: execute,
	accountRequired: true,
	description: "Your profile in Save Easily",
	options: [
		new Option({
			type: optionTypes.USER,
			description: "Target user to view profile",
			name: "user",
			required: false,
		}),
	],
});
