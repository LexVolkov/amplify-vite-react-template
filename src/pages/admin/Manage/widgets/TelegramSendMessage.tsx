import React, { useState } from 'react';
import type { Schema } from "../../../../../amplify/data/resource.ts";
import { generateClient } from "aws-amplify/data";
import TelegramSendMessageUI from './TelegramSendMessageUI.tsx';

const client = generateClient<Schema>();

const TelegramSendMessage: React.FC = () => {
    const [botToken, setBotToken] = useState<string>(localStorage.getItem('token') || '');
    const [chatId, setChatId] = useState<number>(Number(localStorage.getItem('chatId')) || 0);
    const [message, setMessage] = useState<string>('');
    const [replyMarkup, setReplyMarkup] = useState<string>(''); // новое состояние для replyMarkup
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sendResult, setSendResult] = useState<string | null>(null);

    const handleSendMessage = async () => {
        if (!chatId) {
            setError('Необходимо заполнить все поля');
            return;
        }

        setError(null);
        setSendResult(null);
        setLoading(true);

        // Формируем payload для запроса
        const payload: { id: number; message: string; replyMarkup?: any } = {
            id: chatId,
            message: message,
        };

         if (replyMarkup.trim() !== '') {
                payload.replyMarkup = replyMarkup;
        }

        try {
            console.log('send message:' , payload)
            const {data, errors} = await client.queries.tgBotSendMessage(payload);
            if(errors) throw new Error(errors[0].message);
            console.log(data)
            if(data){
                try {
                    const parsedResult = JSON.parse(data);
                    console.log(parsedResult)
                    if (parsedResult.data && parsedResult.data.ok) {
                        setSendResult('Сообщение успешно отправлено');
                        setMessage('');
                        localStorage.setItem('token', botToken);
                        localStorage.setItem('chatId', chatId.toString());
                    } else {
                        setError(parsedResult.data.description || 'Ошибка отправки сообщения');
                    }
                } catch (parseError: any) {
                    setError('Ошибка парсинга ответа: ' + parseError.message);
                    setLoading(false);
                    return;
                }
            }



        } catch (err: any) {
            setError('Ошибка: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <TelegramSendMessageUI
            botToken={botToken}
            chatId={chatId}
            message={message}
            replyMarkup={replyMarkup}
            loading={loading}
            error={error}
            sendResult={sendResult}
            onBotTokenChange={(value: string) => setBotToken(value)}
            onChatIdChange={(value: number) => setChatId(value)}
            onMessageChange={(value: string) => setMessage(value)}
            onReplyMarkupChange={(value: string) => setReplyMarkup(value)}
            onSendMessage={handleSendMessage}
        />
    );
};

export default TelegramSendMessage;
