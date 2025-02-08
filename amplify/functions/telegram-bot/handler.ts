import { env } from "$amplify/env/telegram-bot"
import {Schema} from "../../data/resource";

export const handler: Schema["telegramBot"]["functionHandler"] = async (event) => {
    const url = env.API_ENDPOINT;
    const { name } = event.arguments
    console.info(env.T_BOT_TOKEN);
    try {
        const {body} = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: 359474913,
                text: `Hello from your bot! - ${name}`
            })
        });
        console.info(body);
        return JSON.stringify(body).toString();
    } catch (e) {
        console.error(e);
        return JSON.stringify(e).toString();
    }
};