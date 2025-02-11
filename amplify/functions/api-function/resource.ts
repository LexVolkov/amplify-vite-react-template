import {defineFunction, secret} from "@aws-amplify/backend";

export const apiFunction = defineFunction({
    name: "api-function",
    environment: {
        API_ENDPOINT: `https://api.telegram.org/bot${secret('T_BOT_TOKEN')}/sendMessage`,
        T_BOT_TOKEN: secret('T_BOT_TOKEN'),
        USER_POOL_ID: secret('USER_POOL_ID'),
        COGNITO_CLIENT_ID: secret('COGNITO_CLIENT_ID'),
        ROOT_ENDPOINT: secret('ROOT_ENDPOINT'),
        TOKEN_EXPIRATION: '3600',
        JWT_SECRET: secret('JWT_SECRET'),
        JWT_EXPIRES_IN: '1h',
        FRONTEND_LOGIN_URL: secret('FRONTEND_LOGIN_URL'),
        GROUP_NAME: 'KIDS',
    },
    entry: './handler.ts',
});