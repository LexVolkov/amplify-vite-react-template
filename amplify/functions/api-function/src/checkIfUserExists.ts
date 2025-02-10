import AWS from "aws-sdk";
const cognito = new AWS.CognitoIdentityServiceProvider();


/**
 * Проверяет, существует ли пользователь в Cognito.
 * @param username - Уникальный идентификатор пользователя.
 * @returns true, если пользователь существует, иначе false.
 */
export const checkIfUserExists = async (username: string): Promise<boolean> => {
    const userPoolId = process.env.USER_POOL_ID; // Идентификатор вашего User Pool

    if (!userPoolId) {
        throw new Error("Cognito User Pool ID not configured");
    }

    try {
        await cognito.adminGetUser({
            UserPoolId: userPoolId,
            Username: username,
        }).promise();
        return true; // Пользователь существует
    } catch (error) {
        if (error instanceof Error && 'code' in error && error.code === "UserNotFoundException") {
            return false; // Пользователь не существует
        }
        throw error; // Другая ошибка
    }
};