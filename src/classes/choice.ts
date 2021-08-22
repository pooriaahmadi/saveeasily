import { choiceModel, optionChoiceInputs } from "../types";

class Choice implements choiceModel {
	displayName;
	name;
	constructor({ displayName, name }: optionChoiceInputs) {
		this.displayName = displayName;
		this.name = name;
	}
}

export default Choice;
