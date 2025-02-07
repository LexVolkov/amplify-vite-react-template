import {Paper, Skeleton, Typography, Box} from '@mui/material';
import Grid from '@mui/material/Grid2';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LoadingButton from '@mui/lab/LoadingButton';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

interface ControlPageUIProps {
    filteredCharacters: Character[];
    isLoading: boolean;
    isLoadingUpdate: boolean;
    isLoadingAchievement: boolean;
    handleChangeCoin: (character: Character, minus?: boolean) => void;
    handleAddAchievement: (character: Character) => void;
}

export default function CharControlPageUI({
                                              filteredCharacters,
                                              isLoading,
                                              isLoadingUpdate,
                                              isLoadingAchievement,
                                              handleChangeCoin,
                                              handleAddAchievement,
                                          }: ControlPageUIProps) {
    return (
        <Grid container spacing={2}>
            <Grid size={12}>
                <Paper elevation={3} sx={{padding: 2}}>
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <Skeleton key={i} variant="rounded" width={'100%'} height={50} sx={{m: 2}}/>
                        ))
                    ) : (
                        filteredCharacters.map((character) => (
                            <Grid direction={{xs: 'column', md: 'row'}} container spacing={2} key={character.id}
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
                                            loading={isLoadingUpdate}
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
                                            loading={isLoadingUpdate}
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
                                            loading={isLoadingAchievement}
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
                                                        {index < character.achievements.length - 1 && <br/>}
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