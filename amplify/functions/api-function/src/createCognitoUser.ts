import AWS from 'aws-sdk';
import { env } from '$amplify/env/api-function';
import {getAmplifyDataClientConfig} from "@aws-amplify/backend/function/runtime";
import {Amplify} from "aws-amplify";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../data/resource";
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);
Amplify.configure(resourceConfig, libraryOptions);

const cognito = new AWS.CognitoIdentityServiceProvider();

const client = generateClient<Schema>();

/**
 * Создает и подтверждает пользователя в Cognito.
 * @param username - Уникальный идентификатор пользователя (например, user_id из Telegram).
 * @param email - Email пользователя.
 * @returns Созданный пользователь.
 */
interface CognitoUserAttribute {
    Name: string;
    Value: string;
}

interface CognitoUser {
    Attributes: CognitoUserAttribute[];
    Enabled: boolean;
    UserCreateDate: Date;
    UserLastModifiedDate: Date;
    UserStatus: string;
    Username: string;
}
interface CognitoCreateUserResponse {
    User: CognitoUser;
}
export const createCognitoUser = async (username: string, userId: number, firstName: string, lastName: string, tgUsername: string) => {
    const userPoolId = env.USER_POOL_ID; // Идентификатор вашего User Pool
    const clientId = env.COGNITO_CLIENT_ID; // Идентификатор клиента Cognito
    const email = username; // Используем username как email

    console.info(userPoolId, clientId, username)

    if (!userPoolId || !clientId) {
        throw new Error("Cognito User Pool ID or Client ID not configured");
    }

    try {
        console.log("Creating Cognito user...")
        // Шаг 1: Создаем пользователя в Cognito
        const createUserParams = {
            UserPoolId: userPoolId,
            Username: username,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: email,
                },
                {
                    Name: 'email_verified',
                    Value: 'true', // Автоматически подтверждаем email
                },
            ],
            TemporaryPassword: 'TempPass123!', // Временный пароль
            MessageAction: 'SUPPRESS', // Подавляем отправку письма с подтверждением
        };

        const createUserResponse = await cognito.adminCreateUser(createUserParams).promise() as CognitoCreateUserResponse;

        // Шаг 2: Устанавливаем постоянный пароль и подтверждаем пользователя
        const setPasswordParams = {
            UserPoolId: userPoolId,
            Username: username,
            Password: 'PermPass123!', // Постоянный пароль
            Permanent: true, // Делаем пароль постоянным
        };
        await cognito.adminSetUserPassword(setPasswordParams).promise();
        const addUserToGroupParams = {
            UserPoolId: userPoolId,
            Username: username,
            GroupName: env.GROUP_NAME,
        };
        await cognito.adminAddUserToGroup(addUserToGroupParams).promise();

        if(!createUserResponse){
            throw new Error("Failed to create user");
        }
        const sub = createUserResponse.User.Attributes.find((attr:CognitoUserAttribute) => attr.Name === 'sub')?.Value;
        const name = createUserResponse.User.Username;
        if (!sub || !name) {
            throw new Error("User sub attribute not found");
        }
        const fullName = firstName+' '+lastName;
        await client.models.UserProfile.create({
            email: email,
            profileOwner: `${sub}::${name}`,
            fullName: fullName,
            telegramId: userId,
            telegramUsername: tgUsername
        });

        return createUserResponse.User;
    } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
    }
};