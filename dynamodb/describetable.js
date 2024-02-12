import { ddbClient } from "./ddbClient.js";
import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";

const params = {
    TableName: "order"
}

const run = async () => {
   try {
        const data = await ddbClient.send(new DescribeTableCommand(params));
        console.log(data);
   } catch (error) {
        console.log(error);
   } 
}
run();