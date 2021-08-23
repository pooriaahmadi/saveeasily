import Command from "../../classes/command";
import Option from "../../classes/option";
import { executeInputs, optionTypes } from "../../types";
import Embed from "../../classes/embed";
import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const id = interaction.options.getInteger("id", true);
	const save = await user?.getSave(id);
	const token = Math.random();
	if (save) {
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
		const filter = async (i: ButtonInteraction) => {
			if (i.isButton()) {
				return (
					(i.customId === yes.customId || i.customId === no.customId) &&
					i.user.id === interaction.user.id
				);
			}
			return false;
		};
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
				await save.delete();
				await interaction.editReply({
					embeds: [
						new Embed(user).data.setTitle(
							`Save with id ${save.id} has been deleted successfully!`
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
					.setTitle("Requested Save has legs!")
					.setDescription(
						"**`404`**: It seems that requested save has ran away... or is not essentially yours"
					),
			],
			ephemeral: true,
		});
	}
};
export default new Command({
	accountRequired: true,
	execute: execute,
	description: "A command for deleting save",
	options: [
		new Option({
			type: optionTypes.INTEGER,
			description: "Id of your save",
			name: "id",
			required: true,
		}),
	],
});
