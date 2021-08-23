import Command from "../../classes/command";
import Option from "../../classes/option";
import { executeInputs } from "../../types";
import Embed from "../../classes/embed";
import { MessageButton, MessageActionRow, ButtonInteraction } from "discord.js";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const savesCount = await user?.savesCount();
	if (savesCount) {
		const token = Math.random();
		const yes = new MessageButton()
			.setEmoji("<:yes:879283280766185472>")
			.setCustomId("yes" + token)
			.setLabel("Yes")
			.setStyle("SUCCESS");
		const no = new MessageButton()
			.setEmoji("<:no:879283282183868466>")
			.setCustomId("no" + token)
			.setLabel("No")
			.setStyle("DANGER");
		const row = new MessageActionRow().addComponents(yes, no);
		await interaction.reply({
			embeds: [
				new Embed(user).data.setTitle(
					"<a:alert:723793277844848731> Are you sure? <a:alert:723793277844848731>"
				),
			],
			components: [row],
		});
		const filter = (i: ButtonInteraction) =>
			(i.customId === yes.customId || i.customId === no.customId) &&
			i.user.id === interaction.user.id;
		const collector = interaction.channel?.createMessageComponentCollector({
			filter,
			time: 15000,
		});

		collector?.on("collect", async (i) => {
			await i.deferUpdate();
			row.components.forEach((item) => {
				item.disabled = true;
			});
			if (i.customId === yes.customId) {
				await user?.deleteSaves();
				await interaction.editReply({
					embeds: [
						new Embed(user).data.setTitle(
							`All of your saves have been deleted!`
						),
					],
					components: [row],
				});
			} else if (i.customId === no.customId) {
				await interaction.editReply({
					embeds: [new Embed(user).data.setTitle("Operation Cancelled")],
					components: [row],
				});
				return;
			}
		});
	} else {
		await interaction.reply({
			embeds: [
				new Embed(user).data
					.setTitle("You don't have any saves!")
					.setDescription("** Please add a save using `/save add` **"),
			],
			ephemeral: true,
		});
	}
};
export default new Command({
	accountRequired: true,
	execute: execute,
	description: "A command for deleting all of the saves",
});
