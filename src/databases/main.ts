import { Connection } from "mysql";
import { Base, Database } from "../classes/database";
import { databaseConfig } from "../config";

const base = new Base(databaseConfig);
const Main: Database = new Database({ base: base });
base.turnOn().then(() => {
	Main.baseClass = base;
});
export default Main;
