import { createConnection, getConnectionOptions } from "typeorm";

export async function createDbConnection() {
    const connectionOptions = await getConnectionOptions();
    const connection = createConnection(connectionOptions);

    return connection;
}
