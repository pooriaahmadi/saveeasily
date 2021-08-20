import Main from "./main";
import User from "../classes/user";
import { usersModel, usersModelInput } from "../types";
class Users implements usersModel {
	constructor() {}
	all = async () => {
		const users: any = await Main.createQuery("SELECT * FROM users");
		users.forEach((item: { [key: string]: any }, index: number) => {
			users[index] = new User({
				id: item.id,
				discordId: item.discord_id,
				username: item.username,
				discriminator: item.discriminator,
				usedCommands: item.used_commands,
				isStaff: item.is_staff,
				isVip: item.is_vip,
			});
		});
		return users;
	};
	getById = async (id: number) => {
		let user: any = await Main.createQuery(
			`SELECT * FROM users WHERE id=${id}`
		);
		if (user.length) {
			user = user[0];
			return new User({
				id: user.id,
				discordId: user.discord_id,
				username: user.username,
				discriminator: user.discriminator,
				usedCommands: user.used_commands,
				isStaff: user.is_staff,
				isVip: user.is_vip,
			});
		} else {
			return false;
		}
	};
	getByDiscordId = async (id: string | undefined) => {
		let user: any = await Main.createQuery(
			`SELECT * FROM users WHERE discord_id='${id}'`
		);
		if (user.length) {
			user = user[0];
			return new User({
				id: user.id,
				discordId: user.discord_id,
				username: user.username,
				discriminator: user.discriminator,
				usedCommands: user.used_commands,
				isStaff: user.is_staff,
				isVip: user.is_vip,
			});
		} else {
			return false;
		}
	};
	getStaffs = async () => {
		const users: any = await Main.createQuery(
			"SELECT * FROM users WHERE is_staff=1"
		);
		users.forEach((item: { [key: string]: any }, index: number) => {
			users[index] = new User({
				id: item.id,
				discordId: item.discord_id,
				username: item.username,
				discriminator: item.discriminator,
				usedCommands: item.used_commands,
				isStaff: item.is_staff,
				isVip: item.is_vip,
			});
		});
		return users;
	};
	create = async ({ discordId, username, discriminator }: usersModelInput) => {
		const user: any = await Main.createQuery(
			`INSERT INTO users(id, discord_id, username, discriminator, used_commands, is_staff, is_vip) VALUES (NULL, '${discordId}', '${username}', '${discriminator}', 0, 0, 0)`
		);
		return new User({
			id: user.insert_id,
			discordId: discordId,
			username: username,
			discriminator: discriminator,
			usedCommands: 0,
			isStaff: false,
			isVip: false,
		});
	};
}

export default new Users();
