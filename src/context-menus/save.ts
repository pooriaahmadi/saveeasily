import ContextMenu from "../classes/contextMenu";
import { executeInputsContextMenu, contextMenuType } from "../types";
import Embed from "../classes/embed";
const execute = async ({
	interaction,
	client,
	user,
}: executeInputsContextMenu) => {
	const message = await interaction.channel?.messages.fetch(
		interaction.targetId
	);

	if (message) {
		if (!message.content) {
			return await interaction.reply({
				content:
					"Empty Content? Means that there's only embeds in there? So there's nothing to save and BYE",
				ephemeral: true,
			});
		}
		const url = message.content.match(/\bhttp[s]?:\/\/\S+/gi);
		const result = await user?.add({
			content: message.content,
			media: url?.length ? url[0] : null,
		});

		return await interaction.reply({
			embeds: [
				new Embed().data
					.setTitle("Save Added successfully")
					.setDescription(`View it by **/view type:Id id:${result?.id}**`),
			],
			ephemeral: true,
		});
	}
};
export default new ContextMenu({
	accountRequired: true,
	type: contextMenuType.MESSAGE,
	name: "Save",
	execute: execute,
});
