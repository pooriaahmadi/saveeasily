import ContextMenu from "../classes/contextMenu";
import { executeInputsContextMenu, contextMenuType } from "../types";
import Embed from "../classes/embed";
const execute = async ({
	interaction,
	client,
	user,
}: executeInputsContextMenu) => {
	await interaction.deferReply({
		ephemeral: true,
	});
	const message = interaction.options.getMessage(interaction.targetId);

	if (message) {
		if (!message.content) {
			return await interaction.editReply({
				content:
					"Empty Content? Means that there's only embeds in there? So there's nothing to save and BYE",
			});
		}
		if (message.content.length > 200 && !user?.isVip) {
			return await interaction.editReply({
				embeds: [
					new Embed(user).data
						.setTitle("Not enough juice for your content")
						.setDescription(
							"Contents with more that 200 characters needs <:diamond:878301033300910080> **Vip** account, in order for you to add this text, Please use /vip command"
						),
				],
			});
		}
		const url = message.content.match(/\bhttp[s]?:\/\/\S+/gi);
		if (url?.length && !user?.isVip) {
			return await interaction.editReply({
				embeds: [
					new Embed(user).data
						.setTitle("Not enough Juice for MEDIA")
						.setDescription(
							"You're not a vip user, So you can't use media option...\n**Check out vip abilities `/vip`**"
						),
				],
			});
		}
		const result = await user?.add({
			content: message.content,
			media: url?.length ? url[0] : null,
		});

		return await interaction.editReply({
			embeds: [
				new Embed(user).data
					.setTitle("Save Added successfully")
					.setDescription(`View it by **/view type:Id id:${result?.id}**`),
			],
		});
	}
};
export default new ContextMenu({
	accountRequired: true,
	type: contextMenuType.MESSAGE,
	name: "Save",
	execute: execute,
});
