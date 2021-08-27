import Command from "../../classes/command";
import Option from "../../classes/option";
import { executeInputs, optionTypes } from "../../types";
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
			if (content.length > 200 && !user?.vip) {
				return await interaction.reply({
					embeds: [
						new Embed(user).data
							.setTitle("Not enough juice for your content")
							.setDescription(
								"Contents with more that 200 characters needs <:diamond:878301033300910080> **Vip** account, in order for you to add this text, Please use /vip command"
							),
					],
				});
			}
			data["content"] = content;
			save.content = content;
		}
		if (media) {
			if (!user?.vip) {
				return await interaction.reply({
					embeds: [
						new Embed(user).data
							.setTitle("Not enough Juice for MEDIA")
							.setDescription(
								"You're not a vip user, So you can't use media option...\n**Check out vip abilities `/vip`**"
							),
					],
				});
			}
			if (
				!media.match(
					/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
				)
			) {
				return await interaction.reply({
					embeds: [
						new Embed(user).data
							.setTitle("Media is not a valid URL")
							.setDescription(
								"Ex. [this link](https://cdn.discordapp.com/attachments/385837258768515083/878499126403285042/main-qimg-09891e457a2f7d5b5a4ce238538e1726-mzj.png)"
							),
					],
				});
			}
			data["media"] = media;
			save.media = media;
		}
		if (!title && !content && !media) {
			return await interaction.reply({
				embeds: [
					new Embed(user).data.setTitle(
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
		const embed = new Embed(user).data
			.setTitle(save.title ? save.title : `Save ${save.id}`)
			.addField(
				"Content",
				`${save.content} ${save.media?.endsWith(".mp4") ? save.media : ""}`,
				true
			);
		if (save.media && !save.media.endsWith(".mp4")) {
			embed.setImage(save.media);
		}
		return await interaction.reply({
			embeds: [embed],
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
	description: "A command for editing save",
	options: [
		new Option({
			type: optionTypes.INTEGER,
			description: "Id of your save",
			name: "id",
			required: true,
		}),
		new Option({
			type: optionTypes.STRING,
			description: "You new title of save",
			name: "title",
			required: false,
		}),
		new Option({
			type: optionTypes.STRING,
			description: "You new content of save",
			name: "content",
			required: false,
		}),
		new Option({
			type: optionTypes.STRING,
			description: "You new media of save",
			name: "media",
			required: false,
		}),
	],
});
