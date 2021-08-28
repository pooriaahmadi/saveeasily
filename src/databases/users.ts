import Main from "./main";
import User from "../classes/user";
import { usersModel, usersModelInput } from "../types";
import Vip from "../classes/vip";
class Users implements usersModel {
	constructor() {}
	all = async () => {
		const users: any = await Main.createQuery(
			"SELECT users.id, users.discord_id, users.username, users.discriminator, users.used_commands, users.is_staff,vip.id as vip_id, vip.start, vip.end FROM users LEFT JOIN vip on vip.user=users.id"
		);
		users.forEach((item: { [key: string]: any }, index: number) => {
			users[index] = new User({
				id: item.id,
				discordId: item.discord_id,
				username: item.username,
				discriminator: item.discriminator,
				usedCommands: item.used_commands,
				isStaff: item.is_staff,
				vip:
					"vip_id" in item
						? new Vip({
								id: item.vip_id,
								start: item.start,
								end: item.end,
						  })
						: null,
			});
		});
		return users;
	};
	getById = async (id: number) => {
		let user: any = await Main.createQuery(
			`SELECT users.id, users.discord_id, users.username, users.discriminator, users.used_commands, users.is_staff,vip.id as vip_id, vip.start, vip.end FROM users LEFT JOIN vip on vip.user=users.id WHERE users.id=${id}`
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
				vip:
					"vip_id" in user
						? new Vip({
								id: user.vip_id,
								start: user.start,
								end: user.end,
						  })
						: null,
			});
		}
	};
	getByDiscordId = async (id: string | undefined) => {
		let user: any = await Main.createQuery(
			`SELECT users.id, users.discord_id, users.username, users.discriminator, users.used_commands, users.is_staff,vip.id as vip_id, vip.start, vip.end FROM users LEFT JOIN vip on vip.user=users.id WHERE discord_id=${id}`
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
				vip:
					"vip_id" in user
						? new Vip({
								id: user.vip_id,
								start: user.start,
								end: user.end,
						  })
						: null,
			});
		}
	};
	getStaffs = async () => {
		const users: any = await Main.createQuery(
			`SELECT users.id, users.discord_id, users.username, users.discriminator, users.used_commands, users.is_staff,vip.id as vip_id, vip.start, vip.end FROM users LEFT JOIN vip on vip.user=users.id WHERE is_staff=1`
		);
		users.forEach((item: { [key: string]: any }, index: number) => {
			users[index] = new User({
				id: item.id,
				discordId: item.discord_id,
				username: item.username,
				discriminator: item.discriminator,
				usedCommands: item.used_commands,
				isStaff: item.is_staff,
				vip:
					"vip_id" in item
						? new Vip({
								id: item.vip_id,
								start: item.start,
								end: item.end,
						  })
						: null,
			});
		});
		return users;
	};
	create = async ({ discordId, username, discriminator }: usersModelInput) => {
		const user: any = await Main.createQuery(
			`INSERT INTO users(id, discord_id, username, discriminator, used_commands, is_staff) VALUES (NULL, '${discordId}', '${username}', '${discriminator}', 0, 0)`
		);
		return new User({
			id: user.insert_id,
			discordId: discordId,
			username: username,
			discriminator: discriminator,
			usedCommands: 0,
			isStaff: false,
			vip: null,
		});
	};
	savesCount = async () => {
		const result: any = await Main.createQuery("SELECT COUNT(*) FROM saves");
		return result[0]["COUNT(*)"];
	};
	usersCount = async () => {
		const result: any = await Main.createQuery("SELECT COUNT(*) FROM users");
		return result[0]["COUNT(*)"];
	};
}

export default new Users();
