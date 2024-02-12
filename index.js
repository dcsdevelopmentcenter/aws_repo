import { ddbClient } from './ddbClient.js';
import { GetItemCommand, PutItemCommand, ScanCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { UpdateItemCommand } from '@aws-sdk/client-dynamodb';



export const handler = async (event) => {
    console.log("request", JSON.stringify(event, null, 2));
    let body;
    try {


        switch (event.httpMethod) {
            case "GET":
                if (event.queryStringParameters != null) {
                    body = await filterResult(event);
                } else if (event.pathParameters != null) {
                    body = await getProduct(event.pathParameters.id);
                }
                else {
                    body = await getAllProducts();
                }
                break;
            case "POST":
                const data = JSON.parse(event.body);
                body = await createRecord(data);
                break;
            case "DELETE":
                body = await deleteRecord(event.pathParameters.id);
                break;
            case "PUT":
                body = await updateRecord(event);
                break;
            default:
                throw new Error(`Unsupported route: ${event.httpMethod}`);
        }

        console.log(body);
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "success",
                body: body,
            })
        };

    } catch (error) {
        console.error(error);
        body = error.message;
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Failed to perform operation",
                errorMesg: error.message,
                errorStack: error.stack
            })
        };

    }
};

const getProduct = async (productId) => {
    console.log("getProduct");
    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ id: productId })
    }
    try {
        const { Item } = await ddbClient.send(new GetItemCommand(params));
        console.log(Item);
        return (Item) ? unmarshall(Item) : {};

    } catch (error) {
        console.error(error);
        throw error;
    }
}
const getAllProducts = async () => {
    console.log("getAllProducts");
    const param = {
        TableName: process.env.DYNAMODB_TABLE_NAME
    }
    try {

        const { Items } = await ddbClient.send(new ScanCommand(param));
        console.log(Items);
        return (Items) ? Items.map(unmarshall) : {};  //map returns a new array with the results of calling a provided function on every element in the calling array.

    } catch (error) {
        console.error(error);
        throw error;
    }
}
const createRecord = async (data) => {
    console.log("createRecord");

    try {

        data.id = uuidv4();
        const param = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(data || {})
        }

        const result = await ddbClient.send(new PutItemCommand(param));
        console.log(result);
        return result;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteRecord = async (productId) => {
    console.log("deleteRecord");
    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ id: productId })
    }
    try {
        const result = await ddbClient.send(new DeleteItemCommand(params));
        console.log(result);
        return result;

    } catch (error) {

    }
}

const updateRecord = async (event) => {
    console.log("updateRecord");

    try {
        const requestBody = JSON.parse(event.body);
        console.log(`request body ${JSON.stringify(requestBody)}`);
        
        //const requestBody = Object.fromEntries(
        //    Object.entries(filteredRequestBody).filter(([_, v]) => v !== undefined)
        //);
        //console.log(`filtered request body ${JSON.stringify(requestBody)}`);
        const objectKeys = Object.keys(requestBody);
        
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ id: event.pathParameters.id }),
            UpdateExpression: `SET ${objectKeys.map((_, index) => `#key${index} = :value${index}`).join(",")}`,
            ExpressionAttributeNames: objectKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objectKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: requestBody[key],
            }), {})),
        };
        const result = await ddbClient.send(new UpdateItemCommand(params));
        console.log(result);
        return result;

    } catch (error) {
        console.error(error);
        throw error;

    }
}
const filterResult = async (event) => {
    console.log("filterResult");
    const category = event.queryStringParameters.category;
    const productId = event.pathParameters.id;
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            KeyConditionExpression: "id = :productId",
            FilterExpression: "contains (category, :category)",
            ExpressionAttributeValues: {
                ":productId": { S: productId },
                ":category": { S: category }
            }
        }
        const { Items } = await ddbClient.send(new QueryCommand(params));
        console.log(Items);
        return (Items) ? Items.map(unmarshall) : {};

    } catch (error) {
        console.error(error);
        throw error;
    }
}