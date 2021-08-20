import { userModelInputs, userModel, discordInformation } from "../types";
import Main from "../databases/main";
class User implements userModel {
	id;
	discordId;
	username;
	discriminator;
	usedCommands;
	isStaff;
	isVip;
	constructor({
		id,
		discordId,
		username,
		discriminator,
		usedCommands,
		isStaff,
		isVip,
	}: userModelInputs) {
		this.id = id;
		this.discordId = discordId;
		this.username = username;
		this.discriminator = discriminator;
		this.usedCommands = usedCommands;
		this.isStaff = isStaff;
		this.isVip = isVip;
	}
	makeVip = async () => {
		if (!this.isVip) {
			try {
				await Main.createQuery(`UPDATE users set is_vip=1 WHERE id=${this.id}`);
				return true;
			} catch (error) {
				throw error;
			}
		}
		return false;
	};
	makeNormal = async () => {
		if (this.isVip) {
			try {
				await Main.createQuery(`UPDATE users set is_vip=0 WHERE id=${this.id}`);
				return true;
			} catch (error) {
				throw error;
			}
		}
		return false;
	};
	makeStaff = async () => {
		if (!this.isStaff) {
			try {
				await Main.createQuery(
					`UPDATE users set is_staff=1 WHERE id=${this.id}`
				);
				return true;
			} catch (error) {
				throw error;
			}
		}
		return false;
	};
	demote = async () => {
		if (this.isStaff) {
			try {
				await Main.createQuery(
					`UPDATE users set is_staff=0 WHERE id=${this.id}`
				);
				return true;
			} catch (error) {
				throw error;
			}
		}
		return false;
	};
	updateDiscordInformation = async ({
		username,
		discriminator,
	}: discordInformation) => {
		try {
			await Main.createQuery(
				`UPDATE users set username='${username}', discriminator='${discriminator}' WHERE id=${this.id}`
			);
			this.username = username;
			this.discriminator = discriminator;
			return true;
		} catch (error) {
			return false;
		}
	};
}

export default User;
