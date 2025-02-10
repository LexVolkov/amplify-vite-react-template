import { env } from "$amplify/env/tg-bot-send-message"
import {Schema} from "../../data/resource";

export const handler: Schema["tgBotSendMessage"]["functionHandler"] = async (event) => {
    const url = `https://api.telegram.org/bot${env.T_BOT_TOKEN}/sendMessage`;
    const { id, message } = event.arguments
    console.log(`URL: ${url}, ID: ${id}, Message: ${message}`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: id,
                text: message
            })
        });
        const data = await response.json();
        if (!data.ok) {
            console.error(response.status, data.description || 'Ошибка отправки сообщения');
            return data.description || 'Ошибка отправки сообщения';
        }else{
            console.info(data);
            return JSON.stringify({data, success: true}).toString();
        }
    } catch (e) {
        console.error(e);
        return JSON.stringify(e).toString();
    }
};