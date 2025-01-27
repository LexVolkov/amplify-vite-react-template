// AdminCharacterPage.tsx
import {useState, useEffect} from 'react';
import {generateClient} from 'aws-amplify/data';
import {
    TextField,
    Paper, Skeleton, Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Typography from "@mui/material/Typography";
import {Schema} from '../../../amplify/data/resource';
import {ServerSelector} from "../../components/ServerSelector.tsx";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import {GlobalSettings} from "../../utils/DefaultSettings.ts";


const client = generateClient<Schema>();

export default function ControlPage() {
    const user = useSelector((state: RootState) => state.user);
    const [selectedServerId, setSelectedServerId] = useState<string>('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchQuery, setSearchQuery] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingCharsId, setIsLoadingCharsId] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedServerId) fetchCharacters().then();
    }, [selectedServerId]);

    const fetchCharacters = async () => {

        try {
            setIsLoading(true);
            const {data, errors} = await client.models.Character.list({
                filter: {serverId: {eq: selectedServerId}}
            });
            if (errors) {
                console.error(errors);
                setError('Помилка при завантаженні персонажів');
            }
            setCharacters(data);
        } catch (error) {
            console.error('Error fetching characters:', error);
            setError('Помилка при завантаженні персонажів');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeCoin = async (character: Character, minus: boolean = false) => {

        try {
            setIsLoadingCharsId((prev: string[]) => [...prev, character.id]);

            const currentCoin: number = character.coins || 0;
            const coinsAdded: number = GlobalSettings.CoinsAdded.value;
            const resultCoin: number = minus ? currentCoin - coinsAdded : currentCoin + coinsAdded;

            const currentExperience: number = character.experience || 0;
            const coinsExp: number = GlobalSettings.CoinsExp.value;
            const resultExperience: number = minus
                ? currentExperience
                : currentExperience + (coinsAdded * coinsExp);

            const currentLevel: number = character.level || 1;
            const levelUpgradeExp: number = GlobalSettings.LevelUpgradeExp.value;
            const resultLevel = resultExperience > 0
                ? Math.floor(resultExperience / levelUpgradeExp)
                : currentLevel;

            const {data, errors} = await client.models.Character.update({
                id: character.id,
                coins: resultCoin,
                experience: resultExperience,
                level: resultLevel,
            });
            if (errors) {
                console.error(errors);
                setError('Помилка при оновленні монет');
            }
            const {errors: errorsTrans} = await client.models.Transaction.create({
                from: user?.userId || '',
                characterId: character.id,
                amount: coinsAdded,
                reason: 'Coins added',
            });
            if (errorsTrans) {
                console.error(errorsTrans);
                setError('Помилка при запису логів');
            }
            setCharacters((prev: Character[]) => prev.map((char: Character) => char.id === character.id ? data : char));
        } catch (error) {
            console.error('Error update character:', error);
            setError('Помилка при оновленні монет');
        } finally {
            setIsLoadingCharsId((prev: string[]) => prev.filter((id: string) => id !== character.id));
        }
    };


    const filteredCharacters = characters.filter(character =>
        character.nickname.toLowerCase().includes(searchQuery?.toLowerCase() || '')
    );

    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Typography variant="h4" gutterBottom>
                    Керування
                </Typography>
                {error && (
                    <Alert severity="error" sx={{mb: 2}} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}
            </Grid>
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
            <Grid size={12}>
                <Paper elevation={3} sx={{padding: 2}}>
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} variant="rounded" width={'100%'} height={50} sx={{m: 2}}/>
                        ))
                    ) : (
                        filteredCharacters.map((character) => (
                            <Grid direction={{'xs': 'column', 'md': 'row'}} container spacing={2} key={character.id}
                                  sx={{borderBottom: '1px solid #ddd', py: 1}}>
                                <Grid size={{xs: 12, md: 6}} direction={'row'} container spacing={2} >
                                    <Grid size={{xs: 6, md: 2}}>
                                        <Typography variant="h6" color={'textPrimary'} style={{fontWeight: 'bold'}}>
                                            {character.nickname}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 3, md: 2}} sx={{textAlign: 'right'}}>
                                        <Typography variant="body2" color={'textDisabled'}>
                                            Рівень: {character.level}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 3, md: 2}} sx={{textAlign: 'right'}}>
                                        <Typography variant="body2" color={'textDisabled'}>
                                            Досвід: {character.experience}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid direction={'row'}  size={{xs: 12, md: 6}} container spacing={2}
                                style={{marginBottom: '10px'}}>
                                    <Grid size={{xs: 4, md: 3}} sx={{textAlign: 'right'}}>
                                        <LoadingButton
                                            sx={{py: 1, mr: 1}}
                                            loading={isLoadingCharsId.includes(character.id)}
                                            onClick={() => handleChangeCoin(character, true)}
                                            endIcon={<RemoveCircleOutlineIcon/>}
                                            variant={'contained'}
                                            color={'secondary'}
                                        >
                                            Відняти
                                        </LoadingButton>
                                    </Grid>
                                    <Grid size={{xs: 4, md: 2}} sx={{textAlign: 'center'}}>
                                        <Typography variant="h6">
                                            Монети: {character.coins}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 4, md: 3}} sx={{textAlign: 'left'}}>
                                        <LoadingButton
                                            sx={{py: 1, ml: 1}}
                                            loading={isLoadingCharsId.includes(character.id)}
                                            onClick={() => handleChangeCoin(character)}
                                            startIcon={<AddCircleOutlineIcon/>}
                                            variant={'contained'}
                                            color={'secondary'}
                                        >
                                            Додати
                                        </LoadingButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                        ))


                    )}
                </Paper>
            </Grid>
        </Grid>
    );
}