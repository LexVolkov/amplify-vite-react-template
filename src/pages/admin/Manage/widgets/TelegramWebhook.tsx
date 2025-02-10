import React, { useState } from 'react';
import TelegramWebhookUI from './TelegramWebhookUI.tsx';

interface Update {
    update_id: number;
    message?: {
        message_id: number;
        from?: {
            id: number;
            first_name: string;
            username?: string;
        };
        text?: string;
        date: number;
    };
}

const TelegramWebhook: React.FC = () => {
    const [botToken, setBotToken] = useState<string>(localStorage.getItem('token') || '');
    const [webhookUrl, setWebhookUrl] = useState<string>(localStorage.getItem('url') || '');
    const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [pendingMessages, setPendingMessages] = useState<Update[]>([]);

    const handleRefreshWebhook = async () => {
        if (!botToken) {
            setError('Токен бота обязателен');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
            const data = await response.json();
            if (data.ok) {
                setWebhookInfo(data.result);
            } else {
                setError(data.description || 'Ошибка получения информации о вебхуке');
            }
        } catch (err: any) {
            setError('Ошибка: ' + err.message);
        }
        setLoading(false);
    };

    const handleResetPendingMessages = async () => {
        if (!botToken) {
            setError('Токен бота обязателен');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
            const data = await response.json();
            if (data.ok) {
                console.log(data.result)
                setPendingMessages(data.result);
                // Get the last update_id to mark messages as read
                if (data.result.length > 0) {
                    const lastUpdateId = data.result[data.result.length - 1].update_id;
                    await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}`);
                }
                setWebhookInfo((prev) => prev ? { ...prev, pending_update_count: 0 } : null);
            } else {
                setError(data.description || 'Ошибка получения ожидающих сообщений');
            }
        } catch (err: any) {
            setError('Ошибка: ' + err.message);
        }
        setLoading(false);
    };

    const handleSetWebhook = async () => {
        if (!botToken || !webhookUrl) {
            setError('Необходимо указать токен бота и URL вебхука');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const url = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.ok) {
                await handleRefreshWebhook();
                localStorage.setItem('token', botToken);
                localStorage.setItem('url', webhookUrl);
            } else {
                setError(data.description || 'Ошибка установки вебхука');
            }
        } catch (err: any) {
            setError('Ошибка: ' + err.message);
        }
        setLoading(false);
    };

    const handleDeleteWebhook = async () => {
        if (!botToken) {
            setError('Токен бота обязателен');
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
            const data = await response.json();
            if (data.ok) {
                await handleRefreshWebhook();
            } else {
                setError(data.description || 'Ошибка удаления вебхука');
            }
        } catch (err: any) {
            setError('Ошибка: ' + err.message);
        }
        setLoading(false);
    };

    return (
        <TelegramWebhookUI
            botToken={botToken}
            webhookUrl={webhookUrl}
            webhookInfo={webhookInfo}
            loading={loading}
            error={error}
            pendingMessages={pendingMessages}
            onBotTokenChange={(value: string) => setBotToken(value)}
            onWebhookUrlChange={(value: string) => setWebhookUrl(value)}
            onSetWebhook={handleSetWebhook}
            onDeleteWebhook={handleDeleteWebhook}
            onRefreshWebhook={handleRefreshWebhook}
            onResetPendingMessages={handleResetPendingMessages}
        />
    );
};

export default TelegramWebhook;