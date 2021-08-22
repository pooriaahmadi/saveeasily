import { Client as DjsClient } from "discord.js";
import { CategoryModel, CommandModel, contextMenuModel } from "../types";
class Client extends DjsClient {
	categories: { [key: string]: CategoryModel } = {};
	commands: { [ket: string]: { class: CommandModel; category: string } } = {};
	contextMenus: { [key: string]: contextMenuModel } = {};
}
export default Client;
