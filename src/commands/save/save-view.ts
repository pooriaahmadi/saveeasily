import Command from "../../classes/command";
import { executeInputs, optionTypes, saveModel } from "../../types";
import Embed from "../../classes/embed";
import Option from "../../classes/option";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const id = interaction.options.getInteger("id", true);
	const save = await user?.getSave(id);
	if (save) {
		const embed = new Embed(user).data
			.setTitle(save.title ? save.title : `Save ${save.id}`)
			.addField("Content", save.content, true)
			.addField("ID", `**\`${save.id}\`**`, true);
		if (save.media) {
			embed.setImage(save.media);
		}
		await interaction.reply({
			embeds: [embed],
		});
	} else {
		await interaction.reply({
			embeds: [
				new Embed(user).data
					.setTitle("Save has legs!")
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
	description: "View a save",
	execute: execute,
	options: [
		new Option({
			type: optionTypes.INTEGER,
			description: "Id of your save",
			name: "id",
			required: true,
		}),
	],
});
