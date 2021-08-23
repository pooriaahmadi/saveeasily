import {
	choiceModel,
	optionChoiceInputs,
	optionInterface,
	optionModel,
	optionTypes,
} from "../types";
import Choice from "./choice";
class Option implements optionModel {
	type;
	name;
	description;
	required;
	options?: Array<Option>;
	choices: Array<choiceModel> = [];
	constructor({
		type,
		name,
		description,
		required = false,
		options,
	}: optionInterface) {
		this.type = type;
		this.name = name.toLowerCase();
		this.description = description;
		this.required = required;
		this.options = options;
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
	toJSON = () => {
		const data: { [key: string]: any } = {
			name: this.name,
			description: this.description,
			type: this.type,
			choices: this.choices.map((item) => {
				return {
					name: item.displayName,
					value: item.name,
				};
			}),
		};
		if (this.type !== optionTypes.SUB_COMMAND) {
			data["required"] = this.required;
		} else {
			data["options"] = this.options?.map((item) => item.toJSON());
		}
		return data;
	};
}
export default Option;
