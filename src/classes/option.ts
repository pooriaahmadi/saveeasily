import {
	choiceModel,
	optionChoiceInputs,
	optionInterface,
	optionModel,
} from "../types";
import Choice from "./choice";
class Option implements optionModel {
	type;
	name;
	description;
	required;
	choices: Array<choiceModel> = [];
	constructor({ type, name, description, required = false }: optionInterface) {
		this.type = type;
		this.name = name.toLowerCase();
		this.description = description;
		this.required = required;
	}
	addChoice = ({ displayName, name }: optionChoiceInputs) => {
		this.choices.push(
			new Choice({
				displayName: displayName,
				name: name,
			})
		);
		return this;
	};
}
export default Option;
