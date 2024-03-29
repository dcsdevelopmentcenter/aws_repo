
import {CreateTableCommand} from "@aws-sdk/client-dynamodb";
import { ddbClient } from "./ddbClient.js";

export const params = {
    
        "AttributeDefinitions": [ 
           { 
              "AttributeName": "userName",
              "AttributeType": "S"
           },
           { 
            "AttributeName": "orderDate",
            "AttributeType": "S"
         }
        ],
        "KeySchema": [ 
           { 
                "AttributeName": "userName",
                 "KeyType": "HASH"
           },
           { 
                "AttributeName": "orderDate",
                "KeyType": "RANGE"
            }
        ],
        "ProvisionedThroughput": { 
           "ReadCapacityUnits": 1,
           "WriteCapacityUnits": 1
        },
        "TableName": "order_details"
     }


export const run = async () => {
    try {
        const data = await ddbClient.send(new CreateTableCommand(params));
        console.log("Table Created", data);
    } catch (error) {
        console.log("Error", error);
    }
}
run();