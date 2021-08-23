import { MessageEmbed } from "discord.js";
import { footer } from "../config";
import { userModel } from "../types";
class Embed {
	data: MessageEmbed;
	constructor(user?: userModel) {
		this.data = new MessageEmbed().setFooter(footer).setTimestamp();
		if (user?.isVip) {
			this.data.setColor("#00eeff");
		} else if (user?.isStaff) {
			this.data.setColor("#63ff69");
		} else {
			this.data.setColor(3092790);
		}
	}
}

export default Embed;
