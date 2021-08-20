import { Connection } from "mysql";
import { Base, Database } from "../classes/database";
import { databaseConfig } from "../config";

const base = new Base(databaseConfig);
const main: Database = new Database({ base: base });
base.turnOn().then(() => {
	main.baseClass = base;
});
export default main;
