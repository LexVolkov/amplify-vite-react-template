import {
    TextField,
    Paper,
    IconButton,
    Skeleton,
    MenuItem,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {Edit as EditIcon} from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import LoadingButton from '@mui/lab/LoadingButton';
import AssetIcon from '../../../components/AssetIcon.tsx';
import AssetPicker from './components/AssetPicker.tsx';
import {FC} from 'react';
import {DisplayCell} from './components/DisplayCell.tsx';
import BlockIcon from '@mui/icons-material/Block';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface AdminUserPageUIProps {
    users: UserProfile[];
    banedUsers: IsBanedUserInfo[];
    onUserEdit: (userId: string) => void;
    onUserBanned: (userId: string,profileOwner:string, isBanned: boolean) => void;
    onUserSave: (user: UserProfile) => void;
    onCancel: () => void;
    onSetUser: (userId: string, paramName: string, value: string) => void;
    editingId: string | null;
    isLoading: boolean;
    isLoadingEdit: boolean;
}

export const AdminUserPageUI: FC<AdminUserPageUIProps> = ({
                                                              users,
                                                              banedUsers,
                                                              onUserEdit,
                                                              onUserSave,
                                                              onCancel,
                                                              onSetUser,
                                                              editingId,
                                                              isLoading,
                                                              isLoadingEdit,
                                                              onUserBanned,
                                                          }) => {

    return (
        <Paper elevation={3} sx={{padding: 2}}>

                {isLoading ? (
                    Array(3)
                        .fill(0)
                        .map((_, i) => (
                            <Skeleton
                                key={i}
                                variant="rounded"
                                width="100%"
                                height={50}
                                sx={{m: 2}}
                            />
                        ))
                ) : (
                    users.map((user) => (
                        <Grid
                            container
                            spacing={2}
                            key={user.id}
                            sx={{borderBottom: '1px solid #ddd', py: 1}}
                        >
                            {/* Действия */}
                            <Grid size={{xs: 6, md: 1}} sx={{textAlign: 'left'}}>
                                {editingId === user.id ? (
                                    <>
                                        <IconButton size="large" onClick={() => onCancel()}>
                                            <CancelIcon/>
                                        </IconButton>
                                        <IconButton size="large" onClick={() => onUserSave(user)}>
                                            <DoneIcon/>
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <LoadingButton
                                            onClick={() => onUserEdit(user.id)}
                                            loading={isLoadingEdit}
                                        >
                                            <EditIcon/>
                                        </LoadingButton>

                                        {banedUsers.some(u => u.id.toString() === user.profileOwner.toString() && u.banned) ? (
                                            <LoadingButton
                                                onClick={() => onUserBanned(user.id,user.profileOwner, false)}
                                                loading={isLoadingEdit}
                                                color={'secondary'}
                                            >
                                                <FavoriteBorderIcon/>
                                            </LoadingButton>
                                        ) : (
                                            <LoadingButton
                                                onClick={() => onUserBanned(user.id,user.profileOwner, true)}
                                                loading={isLoadingEdit}
                                                color={'error'}
                                            >
                                                <BlockIcon/>
                                            </LoadingButton>
                                        )
                                        }

                                    </>
                                )}
                            </Grid>

                            {/* Аватар */}
                            <Grid size={{xs: 6, md: 1}}>
                                {editingId === user.id ? (
                                    <AssetPicker
                                        value={user.avatar || ''}
                                        onChange={(value) => onSetUser(user.id, 'avatar', value)}
                                    />
                                ) : (
                                    <DisplayCell
                                        label="Avatar"
                                        value={
                                            user.avatar ? <AssetIcon fit={true} assetId={user.avatar} size={100}/> : null
                                        }
                                    />
                                )}
                            </Grid>


                            {/* Full Name */}
                            <Grid size={{xs: 12, md: 2}}>
                                {editingId === user.id ? (
                                    <TextField
                                        fullWidth
                                        value={user.fullName || ''}
                                        onChange={(e) =>
                                            onSetUser(user.id, 'fullName', e.target.value)
                                        }
                                    />
                                ) : (
                                    <DisplayCell label="Full Name" value={user.fullName}/>
                                )}
                            </Grid>

                            {/* Nickname */}
                            <Grid size={{xs: 12, md: 2}}>
                                {editingId === user.id ? (
                                    <TextField
                                        fullWidth
                                        value={user.nickname || ''}
                                        onChange={(e) =>
                                            onSetUser(user.id, 'nickname', e.target.value)
                                        }
                                    />
                                ) : (
                                    <DisplayCell label="Nickname" value={user.nickname}/>
                                )}
                            </Grid>

                            {/* Gender */}
                            <Grid size={{xs: 12, md: 2}}>
                                {editingId === user.id ? (
                                    <TextField
                                        fullWidth
                                        select
                                        value={user.gender || ''}
                                        onChange={(e) =>
                                            onSetUser(user.id, 'gender', e.target.value)
                                        }
                                    >
                                        <MenuItem value="MALE">Male</MenuItem>
                                        <MenuItem value="FEMALE">Female</MenuItem>
                                        <MenuItem value="OTHER">Other</MenuItem>
                                    </TextField>
                                ) : (
                                    <DisplayCell label="Gender" value={user.gender}/>
                                )}
                            </Grid>

                            {/* Telegram ID */}
                            <Grid size={{xs: 12, md: 2}}>
                                {editingId === user.id ? (
                                    <TextField
                                        fullWidth
                                        type="number"
                                        value={user.telegramId || 0}
                                        disabled={true}
                                    />
                                ) : (
                                    <DisplayCell label="Telegram ID" value={user.telegramId}/>
                                )}
                            </Grid>

                            {/* Telegram Username */}
                            <Grid size={{xs: 12, md: 2}}>
                                {editingId === user.id ? (
                                    <TextField
                                        fullWidth
                                        value={user.telegramUsername || ''}
                                        disabled={true}
                                    />
                                ) : (
                                    <DisplayCell
                                        label="Telegram Username"
                                        value={user.telegramUsername}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    ))
                )}
        </Paper>
    );
};
