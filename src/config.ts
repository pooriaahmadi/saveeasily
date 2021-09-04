const testGuild: string = "864457765907988481";
const debug: boolean = false;
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
		host: "79.127.106.158",
		port: 3306,
		username: "remote",
		password: "Kindertouch123",
		databaseName: "saveeasily",
	};
}

const footer: string = "SaveEasily!";
export { testGuild, clientId, databaseConfig, footer };
