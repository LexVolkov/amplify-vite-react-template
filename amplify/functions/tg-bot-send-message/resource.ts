import { defineFunction, secret } from '@aws-amplify/backend';

export const tgBotSendMessage = defineFunction({
    name: 'tg-bot-send-message',
    environment: {
        API_ENDPOINT: `https://api.telegram.org/bot${secret('T_BOT_TOKEN')}/sendMessage`,
        T_BOT_TOKEN: secret('T_BOT_TOKEN'),
        USER_POOL_ID: secret('USER_POOL_ID'),
        COGNITO_CLIENT_ID: secret('COGNITO_CLIENT_ID')
    },
    // optionally specify a path to your handler (defaults to "./handler.ts")
    entry: './handler.ts',

});