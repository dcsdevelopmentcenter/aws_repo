import { ddbClient } from "./ddbClient.js";
import { DeleteTableCommand } from "@aws-sdk/client-dynamodb";

const param = {
    TableName: "order"
}

const run = async () => {
    try {
        const data = await ddbClient.send(new DeleteTableCommand(param));
        console.log("Table deleted", data);
    } catch (error) {
        console.log(error);
    }
}
run();