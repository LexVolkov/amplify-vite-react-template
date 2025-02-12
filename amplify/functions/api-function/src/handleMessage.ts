import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from "aws-lambda";
import {createCognitoUser} from "./createCognitoUser";
import {generateAuthToken} from "./authService";
import {env} from "$amplify/env/api-function";
import {checkIfUserExists} from "./checkIfUserExists";
import {setPassword} from "./setPassword";
import {getAmplifyDataClientConfig} from "@aws-amplify/backend/function/runtime";
import {Amplify} from "aws-amplify";
import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../data/resource";

const {resourceConfig, libraryOptions} = await getAmplifyDataClientConfig(
    env
);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

const FRONTEND_URL = env.FRONTEND_URL;

export async function handleMessage(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
    try {
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

        if (message === "/start") {
            // Если пользователь ещё не создан, создаём его в Cognito
            const userExists = await checkIfUserExists(username);
            if (userExists) {
                console.log("User already exists:", username);
                const mes = `Привіт ${firstName} ${lastName} ! Тицяй /subscription щоб подивитися свої підписки!`;
                await client.queries.tgBotSendMessage({
                    message: mes,
                    id: Number(chatId),
                })
                return {
                    statusCode: 200,
                    body: JSON.stringify({message: "User already exists"}),
                };
            }

            const user = await createCognitoUser(username, userId, firstName, lastName, tgUsername);
            console.log("User created and confirmed successfully:", user);
            const mes = "Вас зареєстровано.";
            await client.queries.tgBotSendMessage({
                message: mes,
                id: Number(chatId),
            })
            return {
                statusCode: 200,
                body: JSON.stringify({message: "User created and confirmed successfully"}),
            };
        } else if (message === "/subscription" || message === "/home") {
            // Генерируем одноразовый токен для ответа на Custom Auth Challenge
            const token = generateAuthToken(username);
            //console.log("Generated token:", token);

            await setPassword(username, token);
            //console.log("Password set successfully");

            const messageParams: {
                chatId: string;
                text: string;
                replyMarkup: NonNullable<unknown> | null;
            } = {
                chatId: chatId,
                text: "",
                replyMarkup: {}
            };
            messageParams.replyMarkup = null;
            const tabLoc = message === "/subscription" ? "&tab=subscription" : "";
            const auth = message === "/subscription" ? `login/?username=${encodeURIComponent(username)}&token=${encodeURIComponent(token)}` : "";
            const loginUrl = `${FRONTEND_URL}${auth}${tabLoc}`;
            console.log("Login URL:", loginUrl);

            if (FRONTEND_URL.includes('localhost')) {
                messageParams.text = loginUrl;
            } else {
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
            console.log('messageParams: ', messageParams)
            try {
              const { errors} =   await client.queries.tgBotSendMessage({
                    message: messageParams.text,
                    id: chatId,
                    replyMarkup: JSON.stringify(messageParams.replyMarkup)
                })
                if(errors){
                    if (errors) console.error(errors[0]?.message || 'Помилка відправки повідомлення');
                }
            } catch (e) {
                console.error(e);
                return JSON.stringify(e).toString();
            }
            console.log("Login message sent successfully");

            return {
                statusCode: 200,
                body: JSON.stringify({message: "Login link sent successfully"}),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Команду не знайдено"}),
        };
    } catch (error) {
        console.error("Error processing message:", error);
        return {
            statusCode: 200,
            body: JSON.stringify({
                error: "Failed to process message"
            }),
        };
    }
}

