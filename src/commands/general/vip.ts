import Command from "../../classes/command";
import Embed from "../../classes/embed";
import { executeInputs } from "../../types";
const execute = async ({ interaction, client }: executeInputs) => {
	return await interaction.reply({
		embeds: [
			new Embed().data
				.setTitle(
					"<:diamond:878301033300910080> VIP abilities <:diamond:878301033300910080>"
				)
				.addField(
					"Media",
					"You can access MEDIA option in saves so you can have your media in a embed image.",
					true
				)
				.addField("Profile Badge", "You'll get a badge in your profile", true)
				.addField(
					"Content",
					"You can add more than 200 characters in content area of save",
					true
				)
				.addField("Embeds", "All of your embeds will have a `Cyan` color", true)
				.addField(
					"Servers",
					"You can add your bot to server even if your server has lower than 20 members",
					true
				)
				.setColor("#00eeff"),
		],
	});
};
export default new Command({
	execute: execute,
	description: "Vip abilities",
});
