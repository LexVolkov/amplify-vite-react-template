import {useState, useEffect, useMemo} from 'react';
import {
    Paper,
    Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {SearchBox} from "../../../components/SearchBox.tsx";
import useRequest from "../../../api/useRequest.ts";
import {
    m_listUsersData, m_mutationUserBanned,
    m_updateUsersProfileData
} from "../../../api/models/UserProfileModels.ts";
import {AdminUserPageUI} from "./AdminUserPageUI.tsx";

export default function AdminUserPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [banedUsers, setBanedUsers] = useState<IsBanedUserInfo[]>([]);
    const [searchQuery, setSearchQuery] = useState<string | null>('');
    const [editingId, setEditingId] = useState<string | null>(null);


    const usersData = useRequest({
        model: m_listUsersData,
        errorCode: '#007:01'
    });
    const userDataUpdate = useRequest({
        model: m_updateUsersProfileData,
        errorCode: '#005:02'
    });
    const userBannedUpdate = useRequest({
        model: m_mutationUserBanned,
        errorCode: '#005:03'
    });

    useEffect(() => {
        usersData.makeRequest().then()
    }, []);


    useEffect(() => {
        if (usersData.result) {
            const {data, usersBaned} = usersData.result;
            setUsers(data);
            setBanedUsers(usersBaned);
        }
    }, [usersData.result]);

    const handleEdit = (id: string) => {
        setEditingId(id);
    };
    const handleCancel = () => {
        setEditingId(null);
    };
    const handleSetUserPar = (
        id: string,
        paramName: string,
        value: string) => {
        if (!id || !paramName) {
            return;
        }
        setUsers(prev => prev.map(c =>
            c.id === id ? {...c, [paramName]: value} : c
        ))
    };
    const handleSaveUserPar = async (userParameters: UserProfile) => {
        const updatedUserPar = {
            id: userParameters.id,
            fullName: userParameters.fullName,
            nickname: userParameters.nickname,
            avatar: userParameters.avatar,
            gender: userParameters.gender,
        }
        userDataUpdate.makeRequest({user: updatedUserPar}).then();
    };

    useEffect(() => {
        if (userDataUpdate.result) {
            const userUpdateResult: Character = userDataUpdate.result;
            if (userUpdateResult.id) {
                setUsers((prev: UserProfile[]) =>
                    prev.map((u: UserProfile) => (u.id === userUpdateResult.id ? userUpdateResult : u))
                );
                setEditingId(null);
            }
        }
    }, [userDataUpdate.result]);

    const handleUserBanned = (userId:string, profileOwner:string, doBanned: boolean) => {
        const bannedText = !doBanned ? 'розбанити' : 'забанити';
        const confirmBanned = window.confirm(`Ти точно хочеш його ${bannedText}?`);
        if (confirmBanned) {
            userBannedUpdate.makeRequest({userId, profileOwner, doBanned}).then();
        }
    }

    useEffect(() => {
        if(userBannedUpdate.result){
            const {usersBanedResult} = userBannedUpdate.result;
            const userBannedUpdateResult: IsBanedUserInfo = usersBanedResult;
            if (userBannedUpdateResult.id) {
                setBanedUsers((prev) =>
                    prev.map((user: IsBanedUserInfo) =>
                        user.id === userBannedUpdateResult.id
                            ? { ...userBannedUpdateResult } // создаём новый объект для обновлённого пользователя
                            : user
                    )
                );
            }
        }

    }, [userBannedUpdate.result]);

    const filteredUsers = useMemo(() => {
        const query = searchQuery?.toLowerCase() || '';
        return users.filter(user => {
            const fullName = user.fullName?.toLowerCase() || '';
            const nickname = user.nickname?.toLowerCase() || '';
            const telegramUsername = user.telegramUsername?.toLowerCase() || '';
            // Если telegramId может быть числом или null, приводим его к строке, если он есть
            const telegramId = user.telegramId != null ? String(user.telegramId).toLowerCase() : '';

            return (
                fullName.includes(query) ||
                nickname.includes(query) ||
                telegramUsername.includes(query) ||
                telegramId.includes(query)
            );
        });
    }, [users, searchQuery]);


    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 12}}>
                <Paper elevation={3} sx={{padding: 2}}>

                    <Box display="flex" alignItems="center">
                        <SearchBox onChange={setSearchQuery}/>
                    </Box>

                </Paper>
            </Grid>

            <Grid size={12}>
                <AdminUserPageUI
                    users={filteredUsers}
                    banedUsers={banedUsers}
                    onUserEdit={handleEdit}
                    onUserSave={handleSaveUserPar}
                    onCancel={handleCancel}
                    onSetUser={handleSetUserPar}
                    onUserBanned={handleUserBanned}
                    editingId={editingId}
                    isLoading={usersData.isLoading}
                    isLoadingEdit={
                        userDataUpdate.isLoading
                    }/>
            </Grid>
        </Grid>
    );
}