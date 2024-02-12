import { ddbClient } from "./ddbClient.js";
import { BatchWriteItemCommand } from "@aws-sdk/client-dynamodb";

export const params = {
    RequestItems: {
        order_details: [
            {
                PutRequest: {
                    Item: {
                        userName: { S: "John" },
                        orderDate: { S: "2022-01-01" }
                    }
                }
            },
            {
                PutRequest: {
                    Item: {
                        userName: { S: "Smith" },
                        orderDate: { S: "2022-01-01" }
                    }
                }
            }

        ]
    }
}

export const run = async () => {
    try {
        const data = await ddbClient.send(new BatchWriteItemCommand(params));
        console.log("Success", data);

    } catch (error) {
        console.log(error);
    }
}
run();
