import { ddbClient } from "./ddbClient.js";
import { ListTablesCommand } from '@aws-sdk/client-dynamodb';

export const run = async () => {
    try {
        const data = await ddbClient.send(new ListTablesCommand({}));
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

run();