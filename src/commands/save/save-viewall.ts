import Command from "../../classes/command";
import { executeInputs } from "../../types";
import { SelectMenuInteraction } from "discord.js";
import { MessageActionRow, MessageSelectMenu } from "discord.js";
import Embed from "../../classes/embed";

const execute = async ({ interaction, client, user }: executeInputs) => {
	const saves = await user?.saves();
	if (saves && saves.length) {
		const row = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId(`${interaction.id}-all`)
				.setPlaceholder("Nothing selected")
				.addOptions(
					saves?.map((item, index) => {
						return {
							label: `ID ${item.id}${item.title ? `: ${item.title}` : ""}`,
							value: String(index),
						};
					}) || []
				)
		);
		const sendMessage = async (id: number = 0) => {
			const save = saves[id];
			const embed = new Embed(user).data
				.setTitle(save.title ? save.title : `Save ${save.id}`)
				.addField("Content", save.content, true);
			if (save.media) {
				embed.setImage(save.media);
			}
			if (interaction.replied) {
				return await interaction.editReply({
					components: [row],
					embeds: [embed],
				});
			}
			await interaction.reply({
				components: [row],
				embeds: [embed],
				ephemeral: true,
			});
		};
		await sendMessage();
		const filter = (i: SelectMenuInteraction) => {
			i.deferUpdate();
			return i.user.id === interaction.user.id;
		};
		const collector = interaction.channel?.createMessageComponentCollector({
			componentType: "SELECT_MENU",
			time: 15000,
			filter: filter,
		});
		collector?.on("collect", (i) => {
			sendMessage(parseInt(i.values[0]));
		});
		collector?.on("end", (collected) => {
			interaction.editReply({
				components: [],
			});
		});
	} else {
		return interaction.reply({
			embeds: [
				new Embed(user).data.setTitle(
					"You don't have any saves... add one using /save add"
				),
			],
		});
	}
};

export default new Command({
	accountRequired: true,
	execute: execute,
	description: "View all of saves you have saved before",
});
