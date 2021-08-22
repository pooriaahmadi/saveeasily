import {
	contextMenuInputs,
	contextMenuModel,
	executeInputsContextMenu,
} from "../types";
import { runAuthenticate } from "./authentication";

class ContextMenu implements contextMenuModel {
	staffRequired;
	accountRequired;
	name;
	type;
	execute;
	constructor({
		name,
		execute,
		staffRequired,
		accountRequired,
		type,
	}: contextMenuInputs) {
		this.accountRequired = accountRequired;
		this.staffRequired = staffRequired;
		this.name = name;
		this.type = type;
		this.execute = execute;
	}
	run = async ({ interaction, client }: executeInputsContextMenu) => {
		await runAuthenticate({
			staffRequired: this.staffRequired,
			interaction: interaction,
			client: client,
			execute: this.execute,
			accountRequired: this.accountRequired,
		});
	};
	toJSON = () => {
		return {
			name: this.name,
			type: this.type,
		};
	};
}
export default ContextMenu;
