import { ddbClient } from "./ddbClient.js";
import { BatchGetItemCommand } from "@aws-sdk/client-dynamodb";

export const params = {
    RequestItems: {
        order_details: {
            Keys: [
                {
                    userName: { S: "Smith" }
                }
            ]
        } 
    }
}

export const run = async () => {
    try {
        const data = await ddbClient.send(new BatchGetItemCommand(params));
        console.log("Success", data);

    } catch (error) {
        console.log(error);
    }
}
run();
