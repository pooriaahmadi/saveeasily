import { MessageEmbed } from "discord.js";
import { footer } from "../config";
class Embed {
	data: MessageEmbed;
	constructor() {
		this.data = new MessageEmbed()
			.setFooter(footer)
			.setTimestamp()
			.setColor(3092790);
	}
}

export default Embed;
