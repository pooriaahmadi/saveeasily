import Command from "../../classes/command";
import { choiceModel, executeInputs, optionModel } from "../../types";
import {
	MessageActionRow,
	MessageSelectMenu,
	SelectMenuInteraction,
} from "discord.js";
import Embed from "../../classes/embed";
const execute = async ({ interaction, client, user }: executeInputs) => {
	const defaultEmbed = new Embed(user).data
		.setTitle(
			"<:diamond:878301033300910080> Welcome To Help Menu <:diamond:878301033300910080>"
		)
		.setDescription("**Please choose one option in the menu below**")
		.addField(
			`What is ${client.user?.username}?`,
			`${client.user?.username} is a bot for saving stuff such as \`messages\`, \`link\`, \`texts\` and \`...\`\Basically you can save whatever you want! Even in different ways! Just use **\`/add\`** command OR right click on any message you want to save it **\`Right click on message => apps > save\`**`,
			true
		)
		.addField(
			"این بات چیست؟",
			"این بات برای سیو کردن متن ها استفاده می شود، مثل میم و مسیج و عکس و ...، به صورت کلی شما می توانید همه چیز را یا این بات ذخیره کنید! فقط کافیه از کامند ادد یا با کلیک راست کردن روی مسیج و انتخاب گزینه سیو از اَپس."
		);
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
		const embed = new Embed(user).data.setTitle(
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
					item.toLocaleUpperCase().replace(/-/g, " "),
					`${
						permissionsString
							? "**Permissions:** " + permissionsString + "\n"
							: ""
					}**Description:** ${command.class.description}\n${
						command.class.options.length
							? "**Options:** " +
							  command.class.options
									.map((item: optionModel) => {
										return `\`\`\`Name: ${item.name}\nDescription: ${
											item.description
										}\nType: ${item.type}\nRequired? ${
											item.required ? "Yes" : "No"
										}\n${
											item.choices.length
												? "Choices: " +
												  item.choices
														.map((choice: choiceModel) => {
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
