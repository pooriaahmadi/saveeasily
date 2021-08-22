import Command from "../../classes/command";
import Option from "../../classes/option";
import { executeInputs } from "../../types";
import Embed from "../../classes/embed";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const savesCount = await user?.savesCount();
	if (savesCount) {
		await user?.deleteSaves();
		await interaction.reply({
			embeds: [
				new Embed().data.setTitle(`All of your saves have been deleted!`),
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
	description: "A command for deleting all of the saves",
});
