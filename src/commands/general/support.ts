import { MessageActionRow, MessageButton } from "discord.js";
import Command from "../../classes/command";
import Embed from "../../classes/embed";
import { executeInputs } from "../../types";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setLabel("Click me!")
			.setStyle("LINK")
			.setURL("https://discord.gg/E4N8FZ3V46")
	);
	return await interaction.reply({
		embeds: [new Embed(user).data.setTitle("Click on a link")],
		components: [row],
	});
};
export default new Command({
	execute: execute,
	description: "Save Easily support server link",
});
