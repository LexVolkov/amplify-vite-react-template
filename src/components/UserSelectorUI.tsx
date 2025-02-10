import {
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import {FC} from "react";


interface UserSelectorUIProps {
    value?: string;
    onChange?: (profileId: string, userId: string) => void;
    isLoading?: boolean;
    userProfiles: UserProfile[] | [];
}

export const UserSelectorUI: FC<UserSelectorUIProps> = ({
                                                            value,
                                                            onChange,
                                                            isLoading,
                                                            userProfiles = []
                                                        }) => {

    return (
        <TextField
            fullWidth
            select
            label={isLoading ? 'Завантаження...' : "Оберіть юзера"}
            value={isLoading ? '' : value}
            onChange={(e) =>
                onChange?.(
                    e.target.value as string,
                    userProfiles.find(
                        u => u.id === e.target.value
                    )?.profileOwner || null
                )
            }
            disabled={isLoading}
        >
            <MenuItem value={''}>
                <Typography variant="h6" color={'textDisabled'}>
                    *Прибрати*
                </Typography>
            </MenuItem>
            {userProfiles.map(userProfile => {
                return (
                    <MenuItem
                        key={userProfile.id}
                        value={userProfile.id}
                    >
                        <Typography
                            variant="h6"
                        >
                            {userProfile.nickname || '-unknown-'}
                        </Typography>
                    </MenuItem>
                );
            })}
        </TextField>
    );
};