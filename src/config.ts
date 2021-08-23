const testGuild: string = "864457765907988481";
const debug: boolean = true;
let clientId: string;
let databaseConfig: {
	host: string;
	port: number;
	username: string;
	password: string;
	databaseName: string;
};
if (debug) {
	clientId = "776890560794853416";
	databaseConfig = {
		host: "localhost",
		port: 3306,
		username: "root",
		password: "",
		databaseName: "saveeasily",
	};
} else {
	clientId = "879048523801317386";
	databaseConfig = {
		host: "localhost",
		port: 3306,
		username: "root",
		password: "Kindertouch123",
		databaseName: "saveeasily",
	};
}

const footer: string = "SaveEasily!";
export { testGuild, clientId, databaseConfig, footer };
