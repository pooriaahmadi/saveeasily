import ContextMenu from "../classes/contextMenu";
import { executeInputsContextMenu, contextMenuType } from "../types";
import Embed from "../classes/embed";
import users from "../databases/users";
const execute = async ({
	interaction,
	client,
	user,
}: executeInputsContextMenu) => {
	const targetUser = await users.getByDiscordId(interaction.targetId);
	const discordUser =
		client.users.cache.get(interaction.targetId) ||
		(await client.users.fetch(interaction.targetId));
	if (!targetUser) {
		return await interaction.reply({
			embeds: [
				new Embed().data.setTitle(
					`User \`${discordUser.username}#${discordUser.discriminator}\` isn't registered yet.`
				),
			],
			ephemeral: true,
		});
	}

	let permissionsString: string = "";
	if (targetUser?.isVip) {
		permissionsString += "<:diamond:878301033300910080> **`Vip`**\n";
	}
	if (targetUser?.isStaff) {
		permissionsString += "<:emerald:878301034227826688> **`Staff`**";
	}
	const embed = new Embed().data
		.setTitle(`${targetUser?.username}#${targetUser?.discriminator} Profile`)
		.addField("Discord id", "**`" + targetUser?.discordId + "`**", true)
		.addField("Id", "**`" + targetUser?.id + "`**", true)
		.addField(
			"Discord",
			"**`" + `${targetUser?.username}#${targetUser?.discriminator}` + "`**",
			true
		)
		.addField("Permissions", permissionsString || "No permissions", true)
		.addField("Used Commands", "**`" + targetUser?.usedCommands + "`**", true)
		.addField("Saves", "**`" + (await targetUser?.savesCount()) + "`**", true)

		.setThumbnail(String(discordUser.avatarURL()));
	return await interaction.reply({
		embeds: [embed],
	});
};
export default new ContextMenu({
	accountRequired: true,
	type: contextMenuType.USER,
	name: "View Profile",
	execute: execute,
});
