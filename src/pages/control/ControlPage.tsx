// AdminCharacterPage.tsx
import {useState, useEffect} from 'react';
import {generateClient} from 'aws-amplify/data';
import {
    TextField,
    Paper, Skeleton,
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
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import {useError} from "../../utils/setError.tsx";
import Box from "@mui/material/Box";


const client = generateClient<Schema>();

export default function ControlPage() {
    const user = useSelector((state: RootState) => state.user);
    const [selectedServerId, setSelectedServerId] = useState<string>('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [searchQuery, setSearchQuery] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingCharsId, setIsLoadingCharsId] = useState<string[]>([]);
    const setError = useError();

    useEffect(() => {
        if (selectedServerId) fetchCharacters().then();
    }, [selectedServerId]);

    const fetchCharacters = async () => {

        try {
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
                setError('#004:01', 'Помилка при отриманні списку персонажів',errors.length >0?errors[0]?.message:'')
                console.error('Error fetching characters:', errors);
                return;
            }
            setCharacters(data);
        } catch (error) {
            setError('#004:02', 'Помилка при отриманні даних персонажів', (error as Error).message)
            console.error('Error fetching characters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeCoin = async (character: Character, minus: boolean = false) => {

        try {
            setIsLoadingCharsId((prev: string[]) => [...prev, character.id]);

            const currentCoin: number = character.coins || 0;
            const coinsAdded: number = Number(GlobalSettings.CoinsAdded.value);
            const resultCoin: number = minus ? currentCoin - coinsAdded : currentCoin + coinsAdded;

            const currentExperience: number = character.experience || 0;
            const coinsExp: number = Number(GlobalSettings.CoinsExp.value);
            const resultExperience: number = minus
                ? currentExperience
                : currentExperience + (coinsAdded * coinsExp);

            const currentLevel: number = character.level || 1;
            const levelUpgradeExp: number = Number(GlobalSettings.LevelUpgradeExp.value);
            const resultLevel = resultExperience > 0
                ? Math.floor(resultExperience / levelUpgradeExp)
                : currentLevel;

            const {data, errors} = await client.models.Character.update({
                id: character.id,
                coins: resultCoin,
                experience: resultExperience,
                level: resultLevel,
            },{selectionSet: [
                    'id',
                    'nickname',
                    'coins',
                    'experience',
                    'level',
                    'characterAvatar',
                    'serverId',
                    'achievements.*']});
            if (errors) {
                setError('#004:03', 'Помилка при оновленні монет', errors.length >0?errors[0]?.message:'')
                console.error('Error update character:', errors);
                return;
            }
            const {errors: errorsTrans} = await client.models.Transaction.create({
                from: user?.userId || '',
                characterId: character.id,
                amount: coinsAdded,
                reason: 'Coins added',
            });
            if (errorsTrans) {
                setError('#004:04', 'Помилка запису логів', errorsTrans.length >0?errorsTrans[0]?.message:'')
                console.error('Error create logs:', errors);
            }
            setCharacters((prev: Character[]) => prev.map((char: Character) => char.id === character.id ? data : char));
        } catch (error) {
            setError('#004:05', 'Помилка при оновленні монет', (error as Error).message)
            console.error('Error update characters:', error);
        } finally {
            setIsLoadingCharsId((prev: string[]) => prev.filter((id: string) => id !== character.id));
        }
    };

    const handleAddAchievement = async (character: Character) => {
        const promptNewAchievement = window.prompt(`Введіть досягнення для персонажа ${character.name}:`);
        const newAchievement = promptNewAchievement?.trim();
        if(newAchievement === ''){
            setError('#004:06', 'Введіть досягнення!')
            return;
        }
        try {
            setIsLoadingCharsId((prev: string[]) => [...prev, character.id]);

            const {data, errors} = await client.models.Achievement.create({
                from: user.userId,
                characterId: character.id,
                content: newAchievement,
            });
            if (errors) {
                setError('#004:07', 'Помилка при створенні нового досягнення', errors.length >0?errors[0]?.message:'')
                console.error('Error create achievement:', errors);
                return;
            }
            setCharacters((prev: Character[]) =>
                prev.map((char: Character) =>
                    char.id === character.id
                        ? { ...char, achievements: char.achievements.concat(data) }
                        : char
                )
            );
        } catch (error) {
            setError('#004:08', 'Помилка при створенні нового досягнення', (error as Error).message)
            console.error('Error create achievement:', error);
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
                                <Grid size={{xs: 12, md: 4}} direction={'row'} container spacing={2}>
                                    <Grid size={{xs: 6, md: 8}}>
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
                                <Grid direction={'row'} size={{xs: 12, md: 4}} container spacing={2}
                                      style={{marginBottom: '10px'}}>
                                    <Grid size={{xs: 4, md: 4}} sx={{textAlign: 'right'}}>
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
                                    <Grid size={{xs: 4, md: 3}} sx={{textAlign: 'center'}}>
                                        <Typography variant="h6">
                                            Монети: {character.coins}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{xs: 4, md: 4}} sx={{textAlign: 'left'}}>
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
                                <Grid direction={'row'} size={{xs: 12, md: 4}} container spacing={2}
                                      style={{marginBottom: '10px'}}>
                                    <Grid size={{xs: 12, md: 6}} sx={{textAlign: 'right'}}>
                                        <LoadingButton
                                            loading={isLoadingCharsId.includes(character.id)}
                                            onClick={() => handleAddAchievement(character)}
                                            endIcon={<EmojiEventsIcon/>}
                                            variant={'outlined'}
                                            color={'primary'}
                                        >
                                            +досягнення
                                        </LoadingButton>
                                    </Grid>
                                    <Grid size={{xs: 12, md: 6}} sx={{textAlign: 'center'}}>
                                        <Box
                                            sx={{
                                                border: '1px solid black',
                                                padding: '5px',
                                                margin: '1px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {character.achievements.length > 0 ? (
                                                character.achievements.map((a: Achievement, index: number) => (
                                                    <Typography key={a.id} variant="body2" color="text.secondary">
                                                        {index + 1} - {a.content}
                                                        {index < character.achievements.length - 1 && <br />}
                                                    </Typography>
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary">
                                                    -/-
                                                </Typography>
                                            )}
                                        </Box>
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