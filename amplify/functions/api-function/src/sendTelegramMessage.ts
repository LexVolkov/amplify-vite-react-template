// Функция для отправки сообщения через Telegram Bot API
import {env} from "$amplify/env/api-function";
export async function sendTelegramMessage(
    chatId: number,
    text: string,
    replyMarkup?: any
): Promise<void> {
    const TELEGRAM_BOT_TOKEN = env.T_BOT_TOKEN;
    if (!TELEGRAM_BOT_TOKEN) {
        throw new Error("TELEGRAM_BOT_TOKEN не задан в переменных окружения.");
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const payload: any = {
        chat_id: chatId,
        text: text,
    };

    if (replyMarkup) {
        payload.reply_markup = replyMarkup;
    }

    interface TelegramResponse {
        ok: boolean;
        // Другие свойства можно добавить по необходимости
    }

    function isTelegramResponse(data: unknown): data is TelegramResponse {
        return typeof data === 'object' && data !== null && 'ok' in data;
    }

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (isTelegramResponse(data)) {
        if (!data.ok) {
            throw new Error(`Ошибка отправки сообщения в Telegram: ${JSON.stringify(data)}`);
        }
    } else {
        throw new Error(`Unexpected response format: ${JSON.stringify(data)}`);
    }
}
