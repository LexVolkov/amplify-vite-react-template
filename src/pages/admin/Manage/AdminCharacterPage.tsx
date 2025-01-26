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

const client = generateClient<Schema>();

export default function AdminCharacterPage() {
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
        serverId: ''
    });

    useEffect(() => {
        if (selectedServerId) fetchCharacters().then();
    }, [selectedServerId]);

    const fetchCharacters = async () => {
        setIsLoading(true);
        const {data} = await client.models.Character.list({
            filter: {serverId: {eq: selectedServerId}}
        });
        setCharacters(data);
        setIsLoading(false);
    };

    const handleEdit = (id:string) => {
        setEditingId(id);
    };

    const handleSave = async (character:Character) => {
        setIsLoading(true);
        await client.models.Character.update(character);
        setEditingId(null);
        fetchCharacters().then();
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
                                onChange={e => setNewCharacter((prev:Character)  => ({...prev, nickname: e.target.value}))}
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
                                <Grid size={{xs: 12, md: 2}} sx={{textAlign: 'left'}}>
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
                                <Grid size={{xs: 12, md: 2}}>
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
                                                    coins: Number(e.target.value)
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
                                                    experience: Number(e.target.value)
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
                                                    level: Number(e.target.value)
                                                } : c
                                            ))}
                                        />
                                    ) : (
                                        'Рівень: ' + character.level
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