import { defineFunction, secret } from '@aws-amplify/backend';

export const telegramBot = defineFunction({

    name: 'telegram-bot',
    environment: {
        API_ENDPOINT: `https://api.telegram.org/bot${secret('T_BOT_TOKEN')}/sendMessage`,
        T_BOT_TOKEN: secret('T_BOT_TOKEN')
    },
    // optionally specify a path to your handler (defaults to "./handler.ts")
    entry: './handler.ts',

});