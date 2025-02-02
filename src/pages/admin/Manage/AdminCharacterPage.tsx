// AdminCharacterPage.tsx
import {useState, useEffect} from 'react';
import {generateClient} from 'aws-amplify/data';
import {
    TextField,
    Button,
    Paper,
    IconButton, Skeleton,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon} from '@mui/icons-material';
import type {Schema} from "../../../../amplify/data/resource.ts";
import {ServerSelector} from "../../../components/ServerSelector.tsx";
import Typography from "@mui/material/Typography";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import AssetIcon from "../../../components/AssetIcon.tsx";
import AssetPicker from "./components/AssetPicker.tsx";
import {useError} from "../../../utils/setError.tsx";

const client = generateClient<Schema>();

export default function AdminCharacterPage() {
    const setError = useError();
    const [selectedServerId, setSelectedServerId] = useState<string>('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchQuery, setSearchQuery] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newCharacter, setNewCharacter] = useState<Character>({
        nickname: '',
        coins: 0,
        experience: 0,
        level: 1,
        serverId: '',
        achievements: []
    });

    useEffect(() => {
        if (selectedServerId) fetchCharacters().then();
    }, [selectedServerId]);

    const fetchCharacters = async () => {
        setIsLoading(true);

        const {data, errors} = await client.models.Character.list({
            filter: {serverId: {eq: selectedServerId}},
            selectionSet: [
                'id',
                'nickname',
                'coins',
                'experience',
                'level',
                'characterAvatar',
                'serverId',
                'achievements.*']
        });
        if (errors) {
            setError('#005:01', 'Помилка при отриманні списку персонажів', errors.length >0?errors[0]?.message:'')
            console.error('Error fetching characters:', errors);
            return;
        }
        setCharacters(data);
        setIsLoading(false);
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
    };

    const handleSave = async (character: Character) => {

        try {
            setIsLoading(true);

            const {errors} = await client.models.Character.update(character);
            if (errors) {
                setError('#005:02', 'Помилка при оновленні персонажа', errors.length >0?errors[0]?.message:'')
                console.error('Error update character:', errors);
                return;
            }
            for (const ach of character.achievements) {
                if(ach.content === ''){
                    await client.models.Achievement.delete({id: ach.id});
                }else{
                    const {errors} = await client.models.Achievement.update({
                        id: ach.id,
                        content: ach.content,
                    });
                    if (errors) {
                        setError('#005:04', 'Помилка при оновленні досягнення', errors.length >0?errors[0]?.message:'')
                        console.error('Error update achievement:', errors);
                        return;
                    }
                }

            }
            setEditingId(null);
            fetchCharacters().then();
        } catch (error) {
            setError('#005:03', 'Помилка при оновленні персонажа', (error as Error).message)
            console.error('Error update characters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsLoading(true);
        await client.models.Character.delete({id});
        fetchCharacters().then();
    };

    const handleAddCharacter = async () => {
        if (newCharacter.nickname === '') {
            alert('Введіть нікнейм');
            return;
        }
        if (!selectedServerId) {
            alert('Виберіть зміну');
            return;
        }

        setIsLoading(true);
        await client.models.Character.create({
            ...newCharacter,
            serverId: selectedServerId
        });
        setNewCharacter({
            nickname: '',
            coins: 0,
            experience: 0,
            level: 1,
            serverId: ''
        });
        fetchCharacters().then();
    };

    const filteredCharacters = characters.filter(character =>
        character.nickname.toLowerCase().includes(searchQuery?.toLowerCase() || '')
    );

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography variant="h4" gutterBottom>
                    Character Management
                </Typography>
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
                <Paper elevation={3} sx={{padding: 2}}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 6}}>
                            <ServerSelector
                                value={selectedServerId}
                                onChange={(serverId) => setSelectedServerId(serverId)}
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <TextField
                                fullWidth
                                label="Пошук"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
                <Paper elevation={3} sx={{padding: 2}}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 6}}>
                            <TextField
                                fullWidth
                                label="Нікнейм"
                                value={newCharacter.nickname}
                                onChange={e => setNewCharacter((prev: Character) => ({
                                    ...prev,
                                    nickname: e.target.value
                                }))}
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<AddIcon/>}
                                onClick={handleAddCharacter}
                            >
                                Додати
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid size={12}>
                <Paper elevation={3} sx={{padding: 2}}>
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} variant="rounded" width={'100%'} height={50} sx={{m: 2}}/>
                        ))
                    ) : (
                        filteredCharacters.map((character) => (
                            <Grid container spacing={2} key={character.id}
                                  sx={{borderBottom: '1px solid #ddd', py: 1}}>
                                <Grid size={{xs: 12, md: 1}} sx={{textAlign: 'left'}}>
                                    {editingId === character.id ? (
                                        <>
                                            <IconButton size={'large'} onClick={() => setEditingId(null)}>
                                                <CancelIcon/>
                                            </IconButton>
                                            <IconButton size={'large'} onClick={() => handleSave(character)}>
                                                <DoneIcon/>
                                            </IconButton>
                                            <IconButton size={'large'} onClick={() => handleDelete(character.id)}>
                                                <DeleteIcon/>
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton onClick={() => handleEdit(character.id)}>
                                            <EditIcon/>
                                        </IconButton>
                                    )}
                                </Grid>
                                <Grid size={{xs: 12, md: 1}}>
                                    {editingId === character.id ? (
                                        <AssetPicker
                                            value={character.characterAvatar || ''}
                                            onChange={value => setCharacters(prev => prev.map(c =>
                                                c.id === character.id ? {...c, characterAvatar: value} : c
                                            ))}
                                        />
                                    ) : (
                                        <AssetIcon assetId={character.characterAvatar}/>
                                    )}
                                </Grid>
                                <Grid size={{xs: 12, md: 2}}>
                                    {editingId === character.id ? (
                                        <TextField
                                            fullWidth
                                            value={character.nickname}
                                            onChange={e => setCharacters(prev => prev.map(c =>
                                                c.id === character.id ? {...c, nickname: e.target.value} : c
                                            ))}
                                        />
                                    ) : (
                                        character.nickname
                                    )}
                                </Grid>
                                <Grid size={{xs: 12, md: 2}} sx={{textAlign: 'right'}}>
                                    {editingId === character.id ? (
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={character.coins}
                                            onChange={e => setCharacters(prev => prev.map(c =>
                                                c.id === character.id ? {
                                                    ...c,
                                                    coins: e.target.value
                                                } : c
                                            ))}
                                        />
                                    ) : (
                                        'Монети: ' + character.coins
                                    )}
                                </Grid>
                                <Grid size={{xs: 12, md: 2}} sx={{textAlign: 'right'}}>
                                    {editingId === character.id ? (
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={character.experience}
                                            onChange={e => setCharacters(prev => prev.map(c =>
                                                c.id === character.id ? {
                                                    ...c,
                                                    experience: e.target.value
                                                } : c
                                            ))}
                                        />
                                    ) : (
                                        'Досвід: ' + character.experience
                                    )}
                                </Grid>
                                <Grid size={{xs: 12, md: 2}} sx={{textAlign: 'right'}}>
                                    {editingId === character.id ? (
                                        <TextField
                                            fullWidth
                                            type="number"
                                            value={character.level}
                                            onChange={e => setCharacters(prev => prev.map(c =>
                                                c.id === character.id ? {
                                                    ...c,
                                                    level: e.target.value
                                                } : c
                                            ))}
                                        />
                                    ) : (
                                        'Рівень: ' + character.level
                                    )}
                                </Grid>
                                <Grid size={{xs: 12, md: 2}} sx={{textAlign: 'right'}}>
                                    {editingId === character.id ? (
                                        <>
                                            <Typography>Досягнення</Typography>
                                            {character.achievements.length > 0 ? (
                                                character.achievements.map((a: Achievement) => (
                                                    <TextField
                                                        key={a.id}
                                                        fullWidth
                                                        value={a.content}
                                                        onChange={e => setCharacters(prev => prev.map(c =>
                                                            c.id === character.id ? {
                                                                ...c,
                                                                achievements: c.achievements.map((ach:Achievement) =>
                                                                    ach.id === a.id ? { ...ach, content: e.target.value } : ach
                                                                )
                                                            } : c
                                                        ))}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    -/-
                                                </Typography>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Typography>Досягнення</Typography>
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

                            </Grid>
                        ))


                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}