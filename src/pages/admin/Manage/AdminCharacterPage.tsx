// AdminCharacterPage.tsx
import {useState, useEffect, useMemo} from 'react';
import {
    Paper,
    IconButton,
    Box,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Add as AddIcon} from '@mui/icons-material';
import {ServerSelector} from "../../../components/ServerSelector.tsx";
import {SearchBox} from "../../../components/SearchBox.tsx";
import useRequest from "../../../api/useRequest.ts";
import {
    m_createCharacter,
    m_deleteCharacter,
    m_listCharacters,
    m_updateCharacter
} from "../../../api/models/CharacterModels.ts";
import {m_createAchievement, m_deleteAchievement, m_updateAchievement} from "../../../api/models/AchievementModels.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {AdminCharacterPageUI} from "./AdminCharacterPageUI.tsx";
import {m_listUsersData} from "../../../api/models/UserProfileModels.ts";

export default function AdminCharacterPage() {
    const user = useSelector((state: RootState) => state.user);

    const [selectedServerId, setSelectedServerId] = useState<string>('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchQuery, setSearchQuery] = useState<string | null>('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [users, setUsers] = useState<Server[]>([]);

    const charsData = useRequest({model: m_listCharacters, errorCode: '#005:01'});
    const charsUpdate = useRequest({model: m_updateCharacter, errorCode: '#005:02'});
    const charsCreate = useRequest({model: m_createCharacter, errorCode: '#005:03'});
    const charsDelete = useRequest({model: m_deleteCharacter, errorCode: '#005:04'});
    const deleteAchievement = useRequest({model: m_deleteAchievement, errorCode: '#005:06'});
    const updateAchievement = useRequest({model: m_updateAchievement, errorCode: '#005:07'});
    const addAchievement = useRequest({model: m_createAchievement, errorCode: '#005:08'});
    const userData = useRequest({
        model: m_listUsersData,
        errorCode: '#005:01'
    });

    useEffect(() => {
        userData.makeRequest({}).then()

    }, []);

    useEffect(() => {
        if(userData.result){
            setUsers(userData.result.data);
        }
    }, [userData.result]);

    useEffect(() => {
        if (selectedServerId) {
            setCharacters([]);
            charsData.makeRequest({serverId: selectedServerId}).then();
        }
    }, [selectedServerId]);

    useEffect(() => {
        if (charsData.result) {
            const sortedCharacters = charsData.result.slice().sort((a, b) => a.nickname.localeCompare(b.nickname));
            setCharacters(sortedCharacters);
        }
    }, [charsData.result]);

    const handleEdit = (id: string) => {
        setEditingId(id);
    };
    const handleCancel = () => {
        setEditingId(null);
    };
    const handleSetCharacterPar = (
        characterId: string,
        paramName: string,
        value: string | null) => {
        if(!characterId || !paramName){
            return;
        }
        setCharacters(prev => prev.map(c =>
            c.id === characterId ? {...c, [paramName]: value} : c
        ))
    };
    const handleSetCharacterAchievement = (
        characterId: string,
        achievementId: string,
        value: string) => {
        if(!characterId || !achievementId){
            return;
        }
        setCharacters(prev => prev.map(c =>
            c.id === characterId ? {
                ...c,
                achievements: c.achievements.map((ach: Achievement) =>
                    ach.id === achievementId ? {
                        ...ach,
                        content: value//e.target.value
                    } : ach
                )
            } : c
        ))
    };
    const handleSave = async (character: Character) => {
        charsUpdate.makeRequest({character}).then();
    };

    useEffect(() => {
        if (charsUpdate.result) {
            const charsUpdateResult: Character = charsUpdate.result;
            if (charsUpdateResult.id) {
                const currentUpdatedCharacter = characters.find((char) => char.id === charsUpdateResult.id)
                const newUpdatedCharacter = {...currentUpdatedCharacter}
                setCharacters((prev: Character[]) =>
                    prev.map((char: Character) => (char.id === charsUpdateResult.id ? newUpdatedCharacter : char))
                );
                for (const ach of newUpdatedCharacter.achievements) {
                    const currentAchievement = charsUpdateResult.achievements.find((a: Achievement) => a.id === ach.id)
                    if (!currentAchievement) continue;
                    if (ach.content === currentAchievement.content) continue;
                    if (ach.content === '') {
                        deleteAchievement.makeRequest({id: ach.id}).then()
                    } else {
                        updateAchievement.makeRequest({
                            id: ach.id,
                            content: ach.content,
                        }).then()
                    }
                }
                setEditingId(null);
            }
        }
    }, [charsUpdate.result]);

    useEffect(() => {
        if (deleteAchievement.result) {
            const AchievementDeleteResult: Character = deleteAchievement.result;
            setCharacters((prev: Character[]) =>
                prev.map((char: Character) =>
                    char.id === AchievementDeleteResult.characterId
                        ? {
                            ...char,
                            achievements: char.achievements.filter(
                                (a: Achievement) => a.id !== AchievementDeleteResult.id
                            ),
                        }
                        : char
                )
            );
            setEditingId(null);
        }
    }, [deleteAchievement.result]);

    useEffect(() => {
        if (updateAchievement.result) {
            const updatedAchievement: Character = updateAchievement.result;
            setCharacters((prev: Character[]) =>
                prev.map((char: Character) =>
                    char.id === updatedAchievement.characterId
                        ? {
                            ...char,
                            achievements: char.achievements.map((a: Achievement) =>
                                a.id === updatedAchievement.id
                                    ? updatedAchievement
                                    : a
                            ),
                        }
                        : char
                )
            );
            setEditingId(null);
        }
    }, [updateAchievement.result]);

    const handleDelete = async (id: string) => {
        //TODO удалять также подписки и все связанные с ними данные каскадно
        charsDelete.makeRequest({id}).then();
    };
    useEffect(() => {
        if (charsDelete.result) {
            const charsDeleted: Character = charsDelete.result;
            setCharacters(characters.filter(char => char.id !== charsDeleted.id));
        }
    }, [charsDelete.result]);

    const handleAddCharacter = async () => {
        const promptNewName = window.prompt(`Напиши нікнейм для додавання нового персонажа:`);
        if (!promptNewName) {
            return;
        }
        const newName = promptNewName?.trim();
        if (newName === '') {
            return;
        }
        if (!selectedServerId) {
            alert('Виберіть зміну');
            return;
        }
        const newCharacter: Character = {
            nickname: newName,
            coins: 0,
            experience: 0,
            level: 1,
            serverId: selectedServerId
        }
        charsCreate.makeRequest({character: newCharacter}).then();
    };
    useEffect(() => {
        if (charsCreate.result) {
            const newCharacter: Character = charsCreate.result;
            setCharacters([newCharacter, ...characters]);
        }
    }, [charsCreate.result]);

    const handleAddAchievement = async (character: Character) => {
        const promptNewAchievement = window.prompt(`Введіть назву досягнення для персонажа ${character.name}:`);
        const newAchievement = promptNewAchievement?.trim();
        if (newAchievement === '') {
            return;
        }
        addAchievement.makeRequest({
            from: user.userId,
            characterId: character.id,
            content: newAchievement,
        }).then();
    };

    useEffect(() => {
        if (addAchievement.result) {
            const addAchResult: Character = addAchievement.result;
            setCharacters((prev: Character[]) =>
                prev.map((char: Character) =>
                    char.id === addAchResult.characterId
                        ? {...char, achievements: char.achievements.concat(addAchResult)}
                        : char
                )
            );
        }
    }, [addAchievement.result]);



    const filteredCharacters = useMemo(() => {
        return characters.filter(character =>
            character.nickname.toLowerCase().includes(searchQuery?.toLowerCase() || '')
        );
    }, [characters, searchQuery]);

    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 12}}>
                <Paper elevation={3} sx={{padding: 2}}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 6}}>
                            <ServerSelector
                                value={selectedServerId}
                                onChange={(serverId) => setSelectedServerId(serverId)}
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <Box display="flex" alignItems="center">
                                <SearchBox onChange={setSearchQuery}/>
                                <IconButton
                                    color="secondary"
                                    aria-label="add character"
                                    onClick={handleAddCharacter}
                                    sx={{
                                        padding: '10px',
                                        margin: '10px',
                                    }}
                                    disabled={charsCreate.isLoading}
                                >
                                    <AddIcon/>
                                </IconButton>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>

            <Grid size={12}>
                <AdminCharacterPageUI
                    users={users}
                    characters={filteredCharacters}
                    onCharEdit={handleEdit}
                    onCharSave={handleSave}
                    onCharDelete={handleDelete}
                    onCancel={handleCancel}
                    onSetChar={handleSetCharacterPar}
                    onAddAchievement={handleAddAchievement}
                    onUpdateAchievement={handleSetCharacterAchievement}
                    editingId={editingId}
                    isLoading={charsData.isLoading}
                    isLoadingEdit={charsCreate.isLoading ||
                        charsUpdate.isLoading ||
                        charsDelete.isLoading ||
                        deleteAchievement.isLoading ||
                        updateAchievement.isLoading ||
                        addAchievement.isLoading}
                isLoadingUsers={userData.isLoading}/>
            </Grid>
        </Grid>
    );
}