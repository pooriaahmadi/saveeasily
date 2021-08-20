import Command from "../classes/command";
import { executeInputs } from "../types";
import Embed from "../classes/embed";

const execute = async ({ interaction, client, user }: executeInputs) => {
	console.log(user);
};

export default new Command({
	execute: execute,
	accountRequired: true,
	description: "Your profile in Save Easily",
});
