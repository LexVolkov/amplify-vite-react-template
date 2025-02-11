import AWS from 'aws-sdk';
import { env } from '$amplify/env/api-function';
import {getAmplifyDataClientConfig} from "@aws-amplify/backend/function/runtime";
import {Amplify} from "aws-amplify";
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const cognito = new AWS.CognitoIdentityServiceProvider();


export const setPassword = async (username: string, token: string) => {
    const userPoolId = env.USER_POOL_ID || 'us-east-1_XXXXXXXX'; // Идентификатор вашего User Pool
    const clientId = env.COGNITO_CLIENT_ID || 'XXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Идентификатор клиента Cognito

    if (!userPoolId || !clientId) {
        throw new Error("Cognito User Pool ID or Client ID not configured");
    }

    try {
        const setPasswordParams = {
            UserPoolId: userPoolId,
            Username: username,
            Password: token, // Постоянный пароль
            Permanent: true, // Делаем пароль постоянным
        };
        await cognito.adminSetUserPassword(setPasswordParams).promise();
        return true;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
};