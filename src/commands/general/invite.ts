import { MessageActionRow, MessageButton } from "discord.js";
import Command from "../../classes/command";
import Embed from "../../classes/embed";
import { executeInputs } from "../../types";
const execute = async ({ interaction, client, user }: executeInputs) => {
	await interaction.deferReply();
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setLabel("Full permissions")
			.setStyle("LINK")
			.setURL(
				"https://discord.com/api/oauth2/authorize?client_id=879048523801317386&permissions=8&scope=bot%20applications.commands"
			),
		new MessageButton()
			.setLabel("Necessary Permissions")
			.setStyle("LINK")
			.setURL(
				"https://discord.com/api/oauth2/authorize?client_id=879048523801317386&permissions=242666036289&scope=bot%20applications.commands"
			)
	);
	return await interaction.editReply({
		embeds: [new Embed(user).data.setTitle("Click on a link")],
		components: [row],
	});
};
export default new Command({
	execute: execute,
	description: "Save Easily invite link",
});
