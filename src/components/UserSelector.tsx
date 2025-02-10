import { FC} from "react";
import {UserSelectorUI} from "./UserSelectorUI.tsx";


interface UserSelectorProps {
    inputUsers?: UserProfile[];
    value?: string;
    onChange?: (profileId: string, userId: string) => void;
    isLoading?: boolean;
}

export const UserSelector: FC<UserSelectorProps> = ({ value, onChange, inputUsers, isLoading }) => {

    if(inputUsers === undefined || inputUsers.length === 0){
        return null
    }

    return (
        <UserSelectorUI
            value={value || ''}
            onChange={onChange}
            isLoading={isLoading}
            userProfiles={inputUsers}
        />
    );
};