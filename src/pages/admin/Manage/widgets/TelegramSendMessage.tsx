import React, { useState } from 'react';
import type {Schema} from "../../../../../amplify/data/resource.ts";
import {generateClient} from "aws-amplify/data";
import TelegramSendMassageUI from './TelegramSendMessageUI.tsx';

const client = generateClient<Schema>();

const TelegramSendMessage: React.FC = () => {
    const [botToken, setBotToken] = useState<string>(localStorage.getItem('token') || '');
    const [chatId, setChatId] = useState<number>(Number(localStorage.getItem('chatId')) || 0);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sendResult, setSendResult] = useState<string | null>(null);

    const handleSendMessage = async () => {
        if ( !chatId ) {
            setError('Необходимо заполнить все поля');
            return;
        }

        setError(null);
        setSendResult(null);
        setLoading(true);

        try {
            /*const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message
                })
            });*/
            const res = await client.queries.tgBotSendMessage({
                id: chatId,
                message: message
            })

            const data = res.data;
            console.log(data)
            /*
            if (data.ok) {
                setSendResult('Сообщение успешно отправлено');
                setMessage(''); // Очищаем поле сообщения после успешной отправки
                localStorage.setItem('token', botToken);
                localStorage.setItem('chatId', chatId);
            } else {
                setError(data.description || 'Ошибка отправки сообщения');
            }*/
        } catch (err: any) {
            setError('Ошибка: ' + err.message);
        }

        setLoading(false);
    };

    return (
        <TelegramSendMassageUI
            botToken={botToken}
            chatId={chatId}
            message={message}
            loading={loading}
            error={error}
            sendResult={sendResult}
            onBotTokenChange={(value: string) => setBotToken(value)}
            onChatIdChange={(value: number) => setChatId(value)}
            onMessageChange={(value: string) => setMessage(value)}
            onSendMessage={handleSendMessage}
        />
    );
};

export default TelegramSendMessage;