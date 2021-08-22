import Command from "../classes/command";
import { executeInputs, saveModel } from "../types";
import Embed from "../classes/embed";
import Option from "../classes/option";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const id = interaction.options.getInteger("id", true);
	const save = await user?.getSave(id);
	if (save) {
		const embed = new Embed().data
			.setTitle(save.title ? save.title : `Save ${save.id}`)
			.addField("Content", save.content, true);
		if (save.media) {
			embed.setImage(save.media);
		}
		await interaction.reply({
			embeds: [embed],
		});
	} else {
		await interaction.reply({
			embeds: [
				new Embed().data
					.setTitle("Save has legs!")
					.setDescription(
						"It seems that requested save has ran away... or is not essentially yours"
					),
			],
			ephemeral: true,
		});
	}
};

export default new Command({
	accountRequired: true,
	description: "View a save",
	execute: execute,
	options: [
		new Option({
			type: "integer",
			description: "Id of your save",
			name: "id",
			required: true,
		}),
	],
});
