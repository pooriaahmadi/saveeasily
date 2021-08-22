import Command from "../../classes/command";
import Option from "../../classes/option";
import { executeInputs } from "../../types";
import Embed from "../../classes/embed";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const id = interaction.options.getInteger("id", true);
	const save = await user?.getSave(id);
	if (save) {
		await save.delete();
		await interaction.reply({
			embeds: [
				new Embed().data.setTitle(
					`Save with id ${save.id} has been deleted successfully!`
				),
			],
			ephemeral: true,
		});
	} else {
		await interaction.reply({
			embeds: [
				new Embed().data
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
			type: "integer",
			description: "Id of your save",
			name: "id",
			required: true,
		}),
	],
});
