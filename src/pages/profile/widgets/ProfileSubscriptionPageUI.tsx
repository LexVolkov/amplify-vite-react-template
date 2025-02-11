
import {List, ListItem, ListItemAvatar, ListItemText, Avatar, Paper} from "@mui/material";
import AssetIcon from "../../../components/AssetIcon.tsx";
import {useTheme} from "@mui/material/styles";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import LoadingButton from "@mui/lab/LoadingButton";

interface ProfileSubscriptionPageUIProps {
    chars: Character[];
    onSubscribe: (characterId: string) => void;
    onUnsubscribe: (characterId: string) => void;
    isLoading: string;
}

//создай пропсы для компонента
function ProfileSubscriptionPageUI({ chars, onSubscribe, onUnsubscribe,isLoading }: ProfileSubscriptionPageUIProps) {
    const theme = useTheme();
    const user = useSelector((state: RootState) => state.user);

    return (

        <Paper elevation={3} sx={{mt: 2, p: 2, backgroundColor: theme.palette.background.paper}}>
            <List>
                {chars.map((character) => (
                    <ListItem key={character.id} sx={{display: "flex", alignItems: "center", gap: 2}}>
                        <ListItemAvatar>
                            <Avatar>
                                <AssetIcon fit={true} assetId={character.characterAvatar}/>
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={character.nickname}/>
                        {!character.charSubscription.some((c:CharSubscription) => c.userProfileId === user.userProfileId) ? (
                            <LoadingButton
                                loading={isLoading === character.id}
                                variant="contained"
                                color="primary"
                                onClick={() => onSubscribe(character.id)}
                            >
                                Підписатися
                            </LoadingButton>
                        ) : (
                            <LoadingButton
                                loading={isLoading === character.id}
                                variant="outlined"
                                color="secondary"
                                onClick={() => onUnsubscribe(character.id)}
                            >
                                Відписатися
                            </LoadingButton>
                        )}

                    </ListItem>
                ))}
            </List>
        </Paper>

    );
}

export default ProfileSubscriptionPageUI;
