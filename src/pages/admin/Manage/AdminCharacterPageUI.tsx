import {
    TextField,
    Paper,
    IconButton, Skeleton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {Edit as EditIcon, Delete as DeleteIcon} from '@mui/icons-material';
import Typography from "@mui/material/Typography";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import LoadingButton from "@mui/lab/LoadingButton";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AssetIcon from "../../../components/AssetIcon.tsx";
import AssetPicker from "./components/AssetPicker.tsx";
import {FC} from "react";
import {UserSelector} from "../../../components/UserSelector.tsx";
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';

interface AdminCharacterPageUIProps {
    users: UserProfile[];
    characters: Character[];
    onCharEdit: (characterId: string) => void;
    onCharSave: (character: Character) => void;
    onCharDelete: (characterId: string) => void;
    onCancel: () => void;
    onSetChar: (characterId: string, paramName: string, value: string | null) => void;
    onUpdateAchievement: (characterId: string, achievementId: string, value: string) => void;
    onAddAchievement: (characterId: string) => void;
    editingId: string | null;
    isLoading: boolean;
    isLoadingEdit: boolean;
    isLoadingUsers: boolean;
}

export const AdminCharacterPageUI: FC<AdminCharacterPageUIProps> = ({
                                                                        users,
                                                                        characters,
                                                                        onCharEdit,
                                                                        onCharSave,
                                                                        onCharDelete,
                                                                        onCancel,
                                                                        onSetChar,
                                                                        onAddAchievement,
                                                                        editingId,
                                                                        isLoading,
                                                                        isLoadingEdit,
                                                                        onUpdateAchievement,
                                                                        isLoadingUsers
                                                                    }) => {
    return (
        <Paper elevation={3} sx={{padding: 2}}>
            {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                    <Skeleton key={i} variant="rounded" width={'100%'} height={50} sx={{m: 2}}/>
                ))
            ) : (
                characters.map((character) => (
                    <Grid container spacing={2} key={character.id} sx={{borderBottom: '1px solid #ddd', py: 1}}>
                        <Grid size={{xs: 12, md: 1}} sx={{textAlign: 'left'}}>
                            {editingId === character.id ? (
                                <>
                                    <IconButton size={'large'} onClick={() => onCancel()}>
                                        <CancelIcon/>
                                    </IconButton>
                                    <IconButton size={'large'} onClick={() => onCharSave(character)}>
                                        <DoneIcon/>
                                    </IconButton>
                                    <IconButton size={'large'} onClick={() => onCharDelete(character.id)}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </>
                            ) : (
                                <LoadingButton
                                    onClick={() => onCharEdit(character.id)}
                                    loading={isLoadingEdit}
                                >
                                    <EditIcon/>
                                </LoadingButton>
                            )}
                        </Grid>
                        <Grid size={{xs: 12, md: 1}}>
                            {editingId === character.id ? (
                                <AssetPicker
                                    value={character.characterAvatar || ''}
                                    onChange={value => onSetChar(character.id, 'characterAvatar', value)}
                                />
                            ) : (
                                <AssetIcon fit={true} assetId={character.characterAvatar}/>
                            )}
                        </Grid>
                        <Grid size={{xs: 12, md: 2}}>
                            Нік: {editingId === character.id ? (
                                <TextField
                                    fullWidth
                                    value={character.nickname}
                                    onChange={e => onSetChar(character.id, 'nickname', e.target.value)}
                                />
                            ) : (
                                character.nickname
                            )}
                        </Grid>
                        <Grid size={{xs: 12, md: 2}} sx={{textAlign: 'right'}}>
                            Монети: {editingId === character.id ? (
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={character.coins}
                                    onChange={e => onSetChar(character.id, 'coins', e.target.value)}
                                />
                            ) : (
                                character.coins
                            )}
                        </Grid>
                        <Grid size={{xs: 12, md: 2}} sx={{textAlign: 'right'}}>
                            Досвід: {editingId === character.id ? (
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={character.experience}
                                    onChange={e => onSetChar(character.id, 'experience', e.target.value)}
                                />
                            ) : (
                                character.experience
                            )}
                        </Grid>
                        <Grid size={{xs: 12, md: 1}} sx={{textAlign: 'right'}}>
                            Рівень:  {editingId === character.id ? (
                                <TextField
                                    fullWidth
                                    type="number"
                                    value={character.level}
                                    onChange={e => onSetChar(character.id, 'level', e.target.value)}
                                />
                            ) : (
                                character.level
                            )}
                        </Grid>
                        <Grid size={{xs: 12, md: 2}} sx={{textAlign: 'right'}}>
                            {editingId === character.id ? (
                                <>
                                    <Typography>Нагороди</Typography>
                                    {character.achievements.length > 0 ? (
                                        character.achievements.map((a: Achievement) => (
                                            <TextField
                                                key={a.id}
                                                fullWidth
                                                value={a.content}
                                                onChange={e => onUpdateAchievement(character.id, a.id, e.target.value)}
                                            />
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            -/-
                                        </Typography>
                                    )}
                                    <LoadingButton
                                        loading={isLoadingEdit}
                                        onClick={() => onAddAchievement(character)}
                                        endIcon={<EmojiEventsIcon/>}
                                        variant={'outlined'}
                                        color={'inherit'}
                                        size={'small'}
                                    >
                                        +Нагорода
                                    </LoadingButton>
                                </>
                            ) : (
                                <>
                                    <Typography>Нагороди</Typography>
                                    {character.achievements.length > 0 ? (
                                        character.achievements.map((a: Achievement, index: number) => (
                                            <Typography key={a.id} variant="body2" color="text.secondary">
                                                {index + 1} - {a.content}
                                                {index < character.achievements.length - 1 && <br/>}
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            -/-
                                        </Typography>
                                    )}
                                </>
                            )}
                        </Grid>
                        <Grid size={{xs: 12, md: 1}} sx={{textAlign: 'right'}}>
                             {editingId === character.id ? (
                                <UserSelector
                                    isLoading={isLoadingUsers}
                                    inputUsers={users}
                                    value={character.userProfileId || ''}
                                    onChange={(profileId: string, userId: string) => {
                                        if(userId === null || userId === undefined || userId === ''){
                                            onSetChar(character.id, 'userProfileId', null);
                                            onSetChar(character.id, 'characterOwner', null);
                                        }else{
                                            onSetChar(character.id, 'userProfileId', profileId);
                                            onSetChar(character.id, 'characterOwner', userId+'::'+userId);
                                        }

                                    }}/>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    <EscalatorWarningIcon/> {users.find(
                                        u => {
                                            return u.id === character.userProfileId
                                        })?.
                                        nickname||'Нічийний'}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                ))
            )}
        </Paper>
    );
}
