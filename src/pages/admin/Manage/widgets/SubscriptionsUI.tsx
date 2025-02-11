
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Paper,
    Typography,
    Divider,
    Box,
    Card,
    CardContent,
    CardHeader, Link,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AssetIcon from "../../../../components/AssetIcon";


interface SubscriptionsUIProps {
    chars: Character[];
    onUnsubscribe?: (subscriptionId: string) => void;
    isLoading?: string;
}

function SubscriptionsUI({
                             chars,
                         }: SubscriptionsUIProps) {
    const theme = useTheme();
    return (
        <Paper
            elevation={6}
            sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            }}
        >
            {/* Заголовок всего списка */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
                Підписки
            </Typography>
            <List>
                {chars.map((character) => (
                    <Box key={character.id} mb={3}>
                        <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[3] }}>
                            {/* Заголовок персонажа с аватаром */}
                            <CardHeader
                                avatar={
                                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                                        <AssetIcon fit={true} assetId={character.characterAvatar} />
                                    </Avatar>
                                }
                                title={
                                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                                        {character.nickname}
                                    </Typography>
                                }
                            />
                            <Divider />
                            {/* Список подписок для персонажа */}
                            {character.charSubscription.length > 0 ? (
                                <CardContent>
                                    <List>
                                        {character.charSubscription.map((subscription: CharSubscription) => (
                                            <ListItem
                                                key={subscription.id}
                                                sx={{
                                                    transition: "background-color 0.3s",
                                                    "&:hover": {
                                                        backgroundColor: theme.palette.action.hover,
                                                    },
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar variant="rounded" sx={{ bgcolor: theme.palette.secondary.main }}>
                                                        <AssetIcon fit={true} assetId={subscription.userProfile.avatar} />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={subscription.userProfile.nickname}
                                                    secondary={
                                                        subscription.userProfile.telegramUsername ? (
                                                                <Link color={'secondary'} href={`https://t.me/${subscription.userProfile.telegramUsername}`}>
                                                                    ID: {subscription.userProfile.telegramId}
                                                                </Link>

                                                        ) : (
                                                            `ID: ${subscription.userProfile.telegramId}`
                                                        )
                                                    }
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </CardContent>
                            ) : (
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary" sx={{ pl: 2 }}>
                                        Немає підписок
                                    </Typography>
                                </CardContent>
                            )}
                        </Card>
                    </Box>
                ))}
            </List>
        </Paper>
    );
}

export default SubscriptionsUI;
