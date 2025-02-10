import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {handleMessage} from "./src/handleMessage";

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    return await handleMessage(event);
};