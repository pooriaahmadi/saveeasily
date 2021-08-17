import { optionInterface } from "../types";

class Option implements optionInterface {
	type;
	name;
	description;
	required;
	constructor({ type, name, description, required = false }: optionInterface) {
		this.type = type;
		this.name = name.toLowerCase();
		this.description = description;
		this.required = required;
	}
}
export default Option;
