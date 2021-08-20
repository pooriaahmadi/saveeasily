import { CommandInteraction } from "discord.js";
import { Connection } from "mysql";
import { Client } from "discord.js";

export enum optionType {
	string = "string",
	number = "number",
	boolean = "boolean",
}
export interface optionInterface {
	type: optionType;
	name: string;
	description: string;
	required: boolean;
}

export interface executeInputs {
	interaction: CommandInteraction;
	user?: userModel;
	client: Client;
}

export interface commandInterface {
	staffRequired?: boolean;
	accountRequired?: boolean;
	execute: ({ interaction, user, client }: executeInputs) => void;
	description: string;
	options?: Array<optionInterface>;
}
export interface CommandModel {
	staffRequired: boolean;
	accountRequired: boolean;
	description: string;
	options: Array<optionInterface>;
	execute: ({ interaction, user, client }: executeInputs) => void;
	run: ({ interaction, client }: executeInputs) => void;
	toJSON: (name: string) => object;
}

export interface BaseInputsInterface {
	host: string;
	port: number;
	username: string;
	password: string;
	databaseName: string;
}

export interface BaseModel {
	host: string;
	port: number;
	username: string;
	password: string;
	databaseName: string;
	create: () => void;
	turnOn: () => Promise<any>;
	turnOff: () => void | undefined;
	pause: () => void | undefined;
	resume: () => void | undefined;
	database: Connection | undefined;
}

export interface databaseInputs {
	base: BaseModel;
}

export interface resolveUpdateValuesInputs {
	values: { [key: string]: string };
	table: string;
}

export interface databaseModel {
	baseClass: BaseModel;
	createQuery: (sqlQuery: string) => Promise<any>;
	resolveUpdateValues: ({ values, table }: resolveUpdateValuesInputs) => string;
}

export interface userModelInputs {
	id: number;
	discordId: string | undefined;
	username: string | undefined;
	discriminator: string | undefined;
	usedCommands: number;
	isStaff: boolean;
	isVip: boolean;
}
export interface discordInformation {
	username: string;
	discriminator: string;
}

export interface userModel {
	id: number;
	discordId: string | undefined;
	username: string | undefined;
	discriminator: string | undefined;
	usedCommands: number;
	isStaff: boolean;
	isVip: boolean;
	makeVip: () => Promise<boolean>;
	makeNormal: () => Promise<boolean>;
	makeStaff: () => Promise<boolean>;
	demote: () => Promise<boolean>;
	updateDiscordInformation: ({
		username,
		discriminator,
	}: discordInformation) => Promise<boolean>;
}

export interface usersModelInput {
	discordId: string | undefined;
	username: string | undefined;
	discriminator: string | undefined;
}

export interface usersModel {
	all: () => Promise<Array<userModel>>;
	getById: (id: number) => Promise<userModel | false>;
	getByDiscordId: (id: string | undefined) => Promise<userModel | false>;
	getStaffs: () => Promise<Array<userModel>>;
	create: ({
		discordId,
		username,
		discriminator,
	}: usersModelInput) => Promise<userModel>;
}
