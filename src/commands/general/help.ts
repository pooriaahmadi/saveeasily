import Command from "../../classes/command";
import { executeInputs } from "../../types";
import {
	MessageActionRow,
	MessageSelectMenu,
	SelectMenuInteraction,
} from "discord.js";
import Embed from "../../classes/embed";
const execute = async ({ interaction, client }: executeInputs) => {
	const defaultEmbed = new Embed().data
		.setTitle(
			"<:diamond:878301033300910080> Welcome To Help Menu <:diamond:878301033300910080>"
		)
		.setDescription("**Please choose one option in the menu below**");
	const selectMenu = new MessageSelectMenu()
		.setCustomId(`${interaction.id}-all`)
		.setPlaceholder("Nothing selected")
		.addOptions(
			Object.keys(client.categories).map((item) => {
				const category = client.categories[item];
				return {
					label: category.name,
					value: item,
					emoji: category.emoji,
					description: category.description,
				};
			})
		);
	let row = new MessageActionRow().addComponents(selectMenu);
	const sendMessage = async (key?: string) => {
		if (!key) {
			if (interaction.replied) {
				return await interaction.editReply({
					embeds: [defaultEmbed],
					components: [row],
				});
			}
			return await interaction.reply({
				embeds: [defaultEmbed],
				components: [row],
			});
		}
		selectMenu.options.forEach((item) => {
			if (item.value === key) {
				item.default = true;
			} else {
				item.default = false;
			}
		});
		row = new MessageActionRow().addComponents(selectMenu);
		const category = client.categories[key];
		const embed = new Embed().data.setTitle(
			`${category.emoji} ${category.name} ${category.emoji}`
		);
		Object.keys(client.commands).forEach((item) => {
			const command = client.commands[item];
			let permissionsString: string = "";
			if (command.class.accountRequired) {
				permissionsString += "<:diamond:878301033300910080> **`Account`**\n";
			}
			if (command.class.staffRequired) {
				permissionsString += "<:emerald:878301034227826688> **`Staff`**";
			}
			if (command.category === key) {
				embed.addField(
					item.toLocaleUpperCase(),
					`${
						permissionsString
							? "**Permissions:** " + permissionsString + "\n"
							: ""
					}**Description:** ${command.class.description}\n${
						command.class.options.length
							? "**Options:** " +
							  command.class.options
									.map((item) => {
										return `\`\`\`Name: ${item.name}\nDescription: ${
											item.description
										}\nType: ${item.type}\nRequired? ${
											item.required ? "Yes" : "No"
										}\n${
											"Choices: " + item.choices.length
												? item.choices
														.map((choice) => {
															return `${choice.displayName}`;
														})
														.join(", ")
												: ""
										}\`\`\``;
									})
									.join("\n") +
							  "\n"
							: ""
					}`,
					true
				);
			}
		});
		return await interaction.editReply({
			embeds: [embed],
			components: [row],
		});
	};
	await sendMessage();
	const filter = (i: SelectMenuInteraction) => {
		i.deferUpdate();
		return i.user.id === interaction.user.id;
	};
	const collector = interaction.channel?.createMessageComponentCollector({
		componentType: "SELECT_MENU",
		time: 90000,
		filter: filter,
	});
	collector?.on("collect", async (i) => {
		await sendMessage(i.values[0]);
	});
	collector?.on("end", async (collected) => {
		await sendMessage();
	});
};

export default new Command({
	execute: execute,
	description: "Need help?! use this command!",
});
