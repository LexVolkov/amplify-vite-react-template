import {defineFunction, secret} from "@aws-amplify/backend";

export const apiFunction = defineFunction({
    name: "api-function",
    environment: {
        USER_POOL_ID: secret('USER_POOL_ID'),
        COGNITO_CLIENT_ID: secret('COGNITO_CLIENT_ID'),
        JWT_SECRET: secret('JWT_SECRET'),
        FRONTEND_LOGIN_URL: secret('FRONTEND_LOGIN_URL'),
        //больше не переменных добавлять
    },
    entry: './handler.ts',
});