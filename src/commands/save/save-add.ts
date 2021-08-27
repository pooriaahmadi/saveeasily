import Command from "../../classes/command";
import { executeInputs, optionTypes } from "../../types";
import Embed from "../../classes/embed";
import Option from "../../classes/option";

const execute = async ({ interaction, client, user }: executeInputs) => {
	const content = interaction.options.getString("content", true);
	const media = interaction.options.getString("media", false);
	const title = interaction.options.getString("title", false);
	if (String(content).length > 200 && !user?.vip) {
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
	}
	const save = await user?.add({
		content: content,
		title: title ? title : undefined,
		media: media,
	});
	return await interaction.reply({
		embeds: [
			new Embed(user).data
				.setTitle("Save Added successfully")
				.setDescription(`View it by **/save view ${save?.id}**`),
		],
	});
};

export default new Command({
	accountRequired: true,
	description: "Add a save to your saves",
	execute: execute,
	options: [
		new Option({
			type: optionTypes.STRING,
			description: "Content for the save",
			name: "content",
			required: true,
		}),
		new Option({
			type: optionTypes.STRING,
			description: "Media URL for embed (VIP)",
			name: "media",
			required: false,
		}),
		new Option({
			type: optionTypes.STRING,
			description: "Title for the save",
			name: "title",
			required: false,
		}),
	],
});
