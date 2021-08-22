import {
	userModelInputs,
	userModel,
	discordInformation,
	userAddInputs,
} from "../types";
import Main from "../databases/main";
import Save from "./save";
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
	add = async ({ title, content, media }: userAddInputs) => {
		const result: any = await Main.createQuery(
			`INSERT INTO saves (id, user, title, content, media) VALUES (NULL, ${
				this.id
			}, ${title ? `'${title}'` : "NULL"}, '${content}', ${
				media ? `'${media}'` : "NULL"
			})`
		);
		return new Save({
			id: result.insertId,
			content: content,
			title: title,
			media: media,
		});
	};
	saves = async () => {
		const rawSaves: any = await Main.createQuery(
			`SELECT * FROM saves WHERE user=${this.id}`
		);
		return rawSaves.map((item: { [key: string]: any }) => {
			return new Save({
				id: item.id,
				content: item.content,
				title: item.title,
				media: item.media,
			});
		});
	};
	getSave = async (id: number) => {
		let result: any = await Main.createQuery(
			`SELECT * FROM saves WHERE id=${id}`
		);
		if (result.length) {
			result = result[0];
			if (result.user === this.id) {
				return new Save({
					id: result.id,
					title: result.title,
					content: result.content,
					media: result.media,
				});
			}
		}
		return null;
	};
	addUsedCommand = async (value: number) => {
		this.usedCommands += value;
		await Main.createQuery(
			Main.resolveUpdateValues({
				values: {
					used_commands: String(this.usedCommands),
				},
				table: "users",
			}) + `WHERE id=${this.id}`
		);
	};
	savesCount = async () => {
		const result: any = await Main.createQuery(
			`SELECT COUNT(*) FROM saves WHERE user=${this.id}`
		);
		return result[0]["COUNT(*)"];
	};
}

export default User;
