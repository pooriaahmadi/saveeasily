import { CommandInteraction, ContextMenuInteraction } from "discord.js";
import { Connection } from "mysql";
import Client from "./classes/Client";
export interface choiceModel {
	displayName: string;
	name: string;
}

export type optionTypes =
	| "string"
	| "integer"
	| "boolean"
	| "mentionable"
	| "user";

export interface optionInterface {
	type: optionTypes;
	name: string;
	description: string;
	required: boolean;
}

export interface optionChoiceInputs {
	displayName: string;
	name: string;
}

export interface optionModel {
	type: optionTypes;
	name: string;
	description: string;
	required: boolean;
	choices: Array<choiceModel>;
	addChoice: ({ displayName, name }: optionChoiceInputs) => optionModel;
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
	options?: Array<optionModel>;
}
export interface CommandModel {
	staffRequired: boolean;
	accountRequired: boolean;
	description: string;
	options: Array<optionModel>;
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

export interface userAddInputs {
	content: string;
	title?: string;
	media: string | null;
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
	add: ({ content, media, title }: userAddInputs) => Promise<saveModel>;
	saves: () => Promise<Array<saveModel>>;
	savesCount: () => Promise<number>;
	getSave: (id: number) => Promise<saveModel | null>;
	addUsedCommand: (value: number) => Promise<void>;
	deleteSaves: () => Promise<void>;
}

export interface usersModelInput {
	discordId: string | undefined;
	username: string | undefined;
	discriminator: string | undefined;
}

export interface usersModel {
	all: () => Promise<Array<userModel>>;
	getById: (id: number) => Promise<userModel | undefined>;
	getByDiscordId: (id: string | undefined) => Promise<userModel | undefined>;
	getStaffs: () => Promise<Array<userModel>>;
	savesCount: () => Promise<number>;
	usersCount: () => Promise<number>;
	create: ({
		discordId,
		username,
		discriminator,
	}: usersModelInput) => Promise<userModel>;
}

export interface saveInputModels {
	id: number;
	title?: string;
	content: string;
	media: string | null;
}

export interface saveModel {
	id: number;
	title?: string;

	content: string;
	media: string | null;
	updateMedia: (newMedia: string) => Promise<void>;
	updateContent: (newContent: string) => Promise<void>;
	updateTitle: (newTitle: string) => Promise<void>;
	delete: () => Promise<void>;
}

export interface executeInputsContextMenu {
	interaction: ContextMenuInteraction;
	user?: userModel;
	client: Client;
}

export enum contextMenuType {
	"CHAT_INPUT" = 1,
	"USER" = 2,
	"MESSAGE" = 3,
}

export interface contextMenuInputs {
	staffRequired?: boolean;
	accountRequired?: boolean;
	type: contextMenuType;
	name: string;
	execute: ({
		interaction,
		user,
		client,
	}: executeInputsContextMenu) => Promise<void>;
}
export interface contextMenuModel {
	staffRequired?: boolean;
	accountRequired?: boolean;
	name: string;
	type: contextMenuType;
	execute: ({
		interaction,
		user,
		client,
	}: executeInputsContextMenu) => Promise<void>;
	run: ({ interaction, client }: executeInputsContextMenu) => Promise<void>;
	toJSON: () => { [key: string]: string | number };
}
export interface CategoryInputs {
	name: string;
	emoji?: string;
	description?: string;
}
export interface CategoryModel {
	name: string;
	emoji?: string;
	description?: string;
	getCommands: (dirName: string) => string[];
}
