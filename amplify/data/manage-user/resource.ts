import {defineFunction, secret} from "@aws-amplify/backend"

export const manageUser = defineFunction({
    name: "manage-user",
    environment: {
        USER_POOL_ID: secret('USER_POOL_ID'),
        COGNITO_CLIENT_ID: secret('COGNITO_CLIENT_ID'),
    },
    entry: './handler.ts',
})