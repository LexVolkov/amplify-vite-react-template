import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { createCognitoUser } from "./createCognitoUser";
import { generateAuthToken } from "./authService";
import { env } from "$amplify/env/api-function";
import { checkIfUserExists } from "./checkIfUserExists";
import { setPassword } from "./setPassword";
import {sendTelegramMessage} from "./sendTelegramMessage";

const FRONTEND_LOGIN_URL = env.FRONTEND_LOGIN_URL;

export async function handleMessage(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    const body = JSON.parse(event.body || "{}");
    const message = body.message?.text;

    console.log("message:", message);

    // Используем chat_id для отправки ответа (может быть либо в message.chat, либо message.from)
    const chatId = body.message?.chat?.id || body.message?.from?.id;
    const userId = body.message?.from?.id; // уникальный идентификатор Telegram
    const username = `${userId}@telegram.com`; // формируем имя пользователя для Cognito
    const firstName = body.message?.from?.first_name || '';
    const lastName = body.message?.from?.last_name || '';
    const tgUsername = body.message?.from?.username;

    try {
        if (message === "/start") {
            // Если пользователь ещё не создан, создаём его в Cognito
            const userExists = await checkIfUserExists(username);
            if (userExists) {
                console.log("User already exists:", username);
                await sendTelegramMessage(chatId, `Привіт ${firstName} ${lastName} !`);
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: "User already exists" }),
                };
            }

            const user = await createCognitoUser(username, userId, firstName, lastName, tgUsername);
            console.log("User created and confirmed successfully:", user);
            await sendTelegramMessage(chatId, "Вас зареєстровано.");
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "User created and confirmed successfully" }),
            };
        } else if (message === "/login") {
            //console.log("Login requested for user:", username);
            // Генерируем одноразовый токен для ответа на Custom Auth Challenge
            const token = generateAuthToken(username);
            //console.log("Generated token:", token);

            await setPassword(username, token);
            //console.log("Password set successfully");

            const messageParams = {
                chatId: chatId,
                text: "",
                replyMarkup: {}
            }

            const loginUrl = `${FRONTEND_LOGIN_URL}?username=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}`;
            console.log("Login URL:", loginUrl);

            if(FRONTEND_LOGIN_URL.includes('localhost')){
                messageParams.text = loginUrl;
            }else{
                // Формируем текст сообщения и клавиатуру с кнопкой
                messageParams.text = "Тиць для авторизації на сайті:";
                messageParams.replyMarkup = {
                    inline_keyboard: [
                        [
                            {
                                text: "Тиць сюди",
                                url: loginUrl,
                            },
                        ],
                    ],
                };
            }
            await sendTelegramMessage(messageParams.chatId,messageParams.text,messageParams.replyMarkup);
            //console.log("Login message sent successfully");

            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Login link sent successfully" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Команду не знайдено" }),
        };
    } catch (error) {
        console.error("Error processing message:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Failed to process message"
            }),
        };
    }
}

