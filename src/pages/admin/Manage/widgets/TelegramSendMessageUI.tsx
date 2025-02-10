import React from 'react';
import {
    Button,
    Container,
    Grid,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';

interface TelegramMessageUIProps {
    botToken: string;
    chatId: number;
    message: string;
    loading: boolean;
    error: string | null;
    sendResult: string | null;
    onBotTokenChange: (value: string) => void;
    onChatIdChange: (value: number) => void;
    onMessageChange: (value: string) => void;
    onSendMessage: () => void;
}

const TelegramSendMessageUI: React.FC<TelegramMessageUIProps> = ({
                                                                 botToken,
                                                                 chatId,
                                                                 message,
                                                                 loading,
                                                                 error,
                                                                 sendResult,
                                                                 onBotTokenChange,
                                                                 onChatIdChange,
                                                                 onMessageChange,
                                                                 onSendMessage
                                                             }) => {
    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Telegram Message Sender
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {sendResult && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {sendResult}
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
                            label="Chat ID"
                            value={chatId}
                            onChange={(e) => onChatIdChange(Number(e.target.value))}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Message"
                            value={message}
                            onChange={(e) => onMessageChange(e.target.value)}
                            multiline
                            rows={4}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={onSendMessage}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Send Message'}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default TelegramSendMessageUI;