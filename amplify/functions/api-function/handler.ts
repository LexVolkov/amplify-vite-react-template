import { APIGatewayProxyHandlerV2  } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2  = async (event) => {
    console.log('event:',event)

    const body = JSON.parse(event.body || "{}");
    const message = body.message?.text;

    console.log(`Received message: ${message}`)

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
            "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
        },
        body: JSON.stringify({ response: `You said: ${message}` }),
    };
};