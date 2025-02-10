import React from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

export interface AdminTgPageUIProps {
    botToken: string;
    webhookUrl: string;
    webhookInfo: WebhookInfo | null;
    loading: boolean;
    error: string | null;
    pendingMessages: Update[];
    onBotTokenChange: (value: string) => void;
    onWebhookUrlChange: (value: string) => void;
    onSetWebhook: () => void;
    onDeleteWebhook: () => void;
    onRefreshWebhook: () => void;
    onResetPendingMessages: () => void;
}

const TelegramWebhookUI: React.FC<AdminTgPageUIProps> = ({
                                                             botToken,
                                                             webhookUrl,
                                                             webhookInfo,
                                                             loading,
                                                             error,
                                                             pendingMessages,
                                                             onBotTokenChange,
                                                             onWebhookUrlChange,
                                                             onSetWebhook,
                                                             onDeleteWebhook,
                                                             onRefreshWebhook,
                                                             onResetPendingMessages
                                                         }) => {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Telegram Webhook Admin
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Bot Token"
                            value={botToken}
                            onChange={(e) => onBotTokenChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Webhook URL"
                            value={webhookUrl}
                            onChange={(e) => onWebhookUrlChange(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="outlined"
                            color="warning"
                            fullWidth
                            onClick={onResetPendingMessages}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Reset Pending Messages'}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={onSetWebhook}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Set Webhook'}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            onClick={onDeleteWebhook}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Delete Webhook'}
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onRefreshWebhook}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Refresh Info'}
                        </Button>
                    </Grid>
                </Grid>

                {webhookInfo && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Webhook Information:
                        </Typography>
                        <Typography>
                            <strong>URL:</strong> {webhookInfo.url}
                        </Typography>
                        <Typography>
                            <strong>Pending Updates:</strong> {webhookInfo.pending_update_count}
                        </Typography>
                        {webhookInfo.last_error_date && (
                            <Typography>
                                <strong>Last Error Date:</strong> {new Date(webhookInfo.last_error_date * 1000).toLocaleString()}
                            </Typography>
                        )}
                        {webhookInfo.last_error_message && (
                            <Typography>
                                <strong>Last Error Message:</strong> {webhookInfo.last_error_message}
                            </Typography>
                        )}
                    </Box>
                )}

                {pendingMessages.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Pending Messages ({pendingMessages.length}):
                        </Typography>
                        {pendingMessages.map((update) => (
                            <Accordion key={update.update_id} sx={{ mb: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>
                                        Message {update.message?.message_id} from {update.message?.from?.first_name || 'Unknown'}
                                        {update.message?.from?.username ? ` (@${update.message.from.username})` : ''}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography><strong>Update ID:</strong> {update.update_id}</Typography>
                                    <Typography><strong>Date:</strong> {new Date(update.message?.date ? update.message.date * 1000 : 0).toLocaleString()}</Typography>
                                    <Typography><strong>From ID:</strong> {update.message?.from?.id}</Typography>
                                    <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                        <strong>Text:</strong> {update.message?.text || 'No text content'}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default TelegramWebhookUI;