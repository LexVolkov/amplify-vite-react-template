import {defineFunction, secret} from "@aws-amplify/backend";

export const apiFunction = defineFunction({
    name: "api-function",
    environment: {
        API_ENDPOINT: `https://api.telegram.org/bot${secret('T_BOT_TOKEN')}/sendMessage`,
        T_BOT_TOKEN: secret('T_BOT_TOKEN'),
        USER_POOL_ID: secret('USER_POOL_ID'),
        COGNITO_CLIENT_ID: secret('COGNITO_CLIENT_ID'),
        TABLE_NAME:'AuthToken',
        ROOT_ENDPOINT:'https://62v7x4g5r9.execute-api.us-east-1.amazonaws.com/',
        TOKEN_EXPIRATION: '3600',
        JWT_SECRET: '981d22e1-692f-463e-8feb-95c4c3d60fcb',
        JWT_EXPIRES_IN: '1h',
        FRONTEND_LOGIN_URL: "http://localhost:5173/login",
        GROUP_NAME: 'KIDS',
    },
    entry: './handler.ts',
});