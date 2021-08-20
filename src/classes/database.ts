import mysql, { Connection } from "mysql";
import {
	BaseInputsInterface,
	BaseModel,
	databaseInputs,
	databaseModel,
	resolveUpdateValuesInputs,
} from "../types";
class Base implements BaseModel {
	public host;
	public port;
	public username;
	public password;
	public databaseName;
	private db?: Connection;
	constructor({
		host = "localhost",
		port = 3306,
		username = "root",
		password = "",
		databaseName,
	}: BaseInputsInterface) {
		this.host = host;
		this.port = port;
		this.username = username;
		this.password = password;
		this.databaseName = databaseName;
		this.create();
	}
	create = () => {
		this.db = mysql.createConnection({
			host: this.host,
			port: this.port,
			user: this.username,
			password: this.password,
			database: this.databaseName,
		});
		return this;
	};
	turnOn = () => {
		return new Promise((resolve, reject) => {
			this.db?.connect((err) => {
				return err ? reject(err) : resolve("");
			});
		});
	};
	turnOff = () => {
		return this.db?.destroy();
	};
	pause = () => {
		return this.db?.pause();
	};
	resume = () => {
		return this.db?.resume();
	};
	get database() {
		return this.db;
	}
}

class Database implements databaseModel {
	private base;
	constructor({ base }: databaseInputs) {
		this.base = base;
	}
	set baseClass(newBase: BaseModel) {
		this.base = newBase;
	}
	get baseClass() {
		return this.base;
	}
	createQuery = (sqlQuery: string) => {
		return new Promise((resolve, reject) => {
			this.base.database?.query(sqlQuery, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	};
	resolveUpdateValues = ({ values, table }: resolveUpdateValuesInputs) => {
		let updateQuery = `UPDATE ${table} SET `;
		const keys = Object.keys(values);
		keys.forEach((item, index) => {
			if (typeof values[item] === "string") {
				values[item] = values[item].replace(/'/g, "''");
			}
			updateQuery += `${item}='${values[item]}'`;
			if (index < keys.length - 1) {
				updateQuery += ",";
			}
		});
		return `${updateQuery} `;
	};
}

export { Base, Database };
