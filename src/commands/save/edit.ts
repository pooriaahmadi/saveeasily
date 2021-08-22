import Command from "../../classes/command";
import Option from "../../classes/option";
import { executeInputs } from "../../types";
import Embed from "../../classes/embed";
import Main from "../../databases/main";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const id = interaction.options.getInteger("id", true);
	const title = interaction.options.getString("title", false);
	const content = interaction.options.getString("content", false);
	const media = interaction.options.getString("media", false);
	const save = await user?.getSave(id);
	if (save) {
		const data: { [key: string]: string } = {};
		if (title) {
			data["title"] = title;
			save.title = title;
		}
		if (content) {
			data["content"] = content;
			save.content = content;
		}
		if (media) {
			data["media"] = media;
			save.media = media;
		}
		if (!title && !content && !media) {
			return await interaction.reply({
				embeds: [
					new Embed().data.setTitle(
						"Please include at least a optional option "
					),
				],
				ephemeral: true,
			});
		}
		await Main.createQuery(
			Main.resolveUpdateValues({ values: data, table: "saves" }) +
				`WHERE id=${save.id}`
		);
		const embed = new Embed().data
			.setTitle(save.title ? save.title : `Save ${save.id}`)
			.addField("Content", save.content, true);
		if (save.media) {
			embed.setImage(save.media);
		}
		return await interaction.reply({
			embeds: [embed],
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
	description: "A command for editing save",
	options: [
		new Option({
			type: "integer",
			description: "Id of your save",
			name: "id",
			required: true,
		}),
		new Option({
			type: "string",
			description: "You new title of save",
			name: "title",
			required: false,
		}),
		new Option({
			type: "string",
			description: "You new content of save",
			name: "content",
			required: false,
		}),
		new Option({
			type: "string",
			description: "You new media of save",
			name: "media",
			required: false,
		}),
	],
});
