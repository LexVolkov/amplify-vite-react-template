// CharacterCard.tsx
import {Card, CardContent, Typography, Avatar, Box, LinearProgress, useTheme} from '@mui/material';
import AssetIcon from './AssetIcon';
import React from "react";
import {GlobalSettings} from "../utils/DefaultSettings.ts";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

interface CharacterCardProps {
    character: Character;
    place?: number;
}

const CharacterCard: React.FC<CharacterCardProps> = ({character, place}) => {
    const theme = useTheme();

    // Рассчитываем уровень и прогресс
    const levelUpgradeExp: number = Number(GlobalSettings.LevelUpgradeExp.value);
    const currentLevel = Math.floor(character.experience / levelUpgradeExp);
    const progress = ((character.experience % levelUpgradeExp) / levelUpgradeExp) * 100;

    const getPlaceColor = (position?: number) => {
        if (!position) return theme.palette.secondary.main;
        switch (position) {
            case 1:
                return '#ffc400'; // Золото
            case 2:
                return '#ff0d8e'; // Серебро
            case 3:
                return '#59a608'; // Бронза
            default:
                return theme.palette.primary.main;
        }
    };

    return (
        <Card sx={{
            m: 2,
            width: 300,
            background: theme.palette.background.paper,
            borderRadius: '20px',
            boxShadow: `0 15px 30px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`,
            transition: 'transform 0.3s, box-shadow 0.3s',
            position: 'relative',
            overflow: 'visible',
            '&:hover': {
                transform: 'translateY(-10px)',
                boxShadow: `0 25px 50px ${theme.palette.mode === 'dark' ? 'rgba(0,255,255,0.5)' : 'rgba(0,0,0,0.2)'}`,
                '& .avatar-border': {
                    transform: 'scale(1.1)'
                }
            }
        }}>
            <CardContent>
                {/* Place Badge */}
                {place && (
                    <Box sx={{
                        position: 'absolute',
                        top: -20,
                        left: -20,
                    }}>
                        <Box className="avatar-border" sx={{
                            background: `radial-gradient(circle at 30% 30%, ${getPlaceColor(place)}, ${theme.palette.background.default})`,
                            borderRadius: '50%',
                            padding: '3px',
                            transition: 'transform 0.3s',
                            boxShadow: `0 0 20px ${theme.palette.primary.main}`
                        }}>
                            <Avatar sx={{
                                bgcolor: getPlaceColor(place),
                                width: 50,
                                height: 50,
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                border: `2px solid ${theme.palette.background.paper}`
                            }}>
                                {place}
                            </Avatar>
                        </Box>
                    </Box>
                )}

                {/* Character Avatar */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 4,
                    position: 'relative',
                }}>
                    <AssetIcon
                        assetId={character.characterAvatar}
                        size={100}
                    />
                </Box>

                {/* Nickname */}
                <Typography variant="h5" sx={{
                    mt: 2,
                    textAlign: 'center',
                    background: `linear-gradient(0deg, ${theme.palette.primary.main} 40%, ${theme.palette.secondary.main} 60%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                    textShadow: `0px 0px 55px ${theme.palette.primary.main}`
                }}>
                    {character.nickname}
                </Typography>

                {/* Stats */}
                <Box sx={{
                    mt: 3,
                    display: 'grid',
                    gap: 1,
                    background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderRadius: '15px',
                    p: 2,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '15px',
                        border: `1px solid ${theme.palette.divider}`,
                        pointerEvents: 'none'
                    }
                }}>
                    {/* Level */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: '8px',
                        transition: 'background 0.3s',
                        '&:hover': {
                            background: theme.palette.action.hover
                        }
                    }}>
                        <AssetIcon
                            assetId={GlobalSettings.LevelIcon.value}
                            size={30}
                        />
                        <Typography variant="body2" sx={{color: theme.palette.text.primary, flexGrow: 1}}>
                            Рівень
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.contrastText,
                            textShadow: `0 0 10px ${theme.palette.primary.main}`
                        }}>
                            {currentLevel}
                        </Typography>
                    </Box>


                    {/* Experience Progress */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: '8px',
                        transition: 'background 0.3s',
                        '&:hover': {
                            background: theme.palette.action.hover
                        }
                    }}>
                        <AssetIcon
                            assetId={GlobalSettings.ExperienceIcon.value}
                            size={30}
                        />
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="body2" sx={{color: theme.palette.text.primary, mb: 0.5}}>
                                Досвід
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        borderRadius: 4
                                    }
                                }}
                            />
                            <Typography variant="caption" sx={{
                                display: 'block',
                                textAlign: 'right',
                                color: theme.palette.text.secondary,
                                mt: 0.5,
                                textShadow: `0 0 5px ${theme.palette.primary.main}`
                            }}>
                                {character.experience}/{levelUpgradeExp * (currentLevel + 1)}
                            </Typography>
                        </Box>
                    </Box>
                    {/* Coins */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        p: 1,
                        borderRadius: '8px',
                        transition: 'background 0.3s',
                        '&:hover': {
                            background: theme.palette.action.hover
                        }
                    }}>
                        <AssetIcon
                            assetId={GlobalSettings.CoinIcon.value}
                            size={30}
                        />
                        <Typography variant="body2" sx={{color: theme.palette.text.primary, flexGrow: 1}}>
                            Монети
                        </Typography>
                        <Typography variant="body2" sx={{
                            fontWeight: 'bold',
                            color: theme.palette.primary.contrastText,
                            textShadow: `0 0 10px ${theme.palette.primary.main}`
                        }}>
                            {character.coins}
                        </Typography>
                    </Box>
                    {/* achievements */}
                    {character.achievements.length > 0 ? (
                        <>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            borderRadius: '8px',
                            transition: 'background 0.3s',
                            '&:hover': {
                                background: theme.palette.action.hover
                            }
                        }}>
                            <EmojiEventsIcon sx={{color: theme.palette.secondary.main}}/>
                            <Typography variant="body2" sx={{color: theme.palette.text.primary}}>
                                Нагороди:
                            </Typography>

                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            borderRadius: '8px',
                            transition: 'background 0.3s',
                            '&:hover': {
                                background: theme.palette.action.hover
                            }
                        }}>
                            <Box
                                sx={{
                                    border: '1px solid black',
                                    padding: '5px',
                                    margin: '1px',
                                    textAlign: 'center',
                                }}
                            >
                                {character.achievements.map((a: Achievement, index: number) => (
                                    <Typography variant="body2" key={a.id} sx={{
                                        fontWeight: 'bold',
                                        color: theme.palette.primary.contrastText,
                                        textShadow: `0 0 10px ${theme.palette.primary.main}`,
                                        textAlign: 'left',
                                    }}>
                                        <MilitaryTechIcon
                                            style={{
                                            verticalAlign: 'middle'
                                        }}
                                            fontSize={'small'}
                                            color={'primary'}/>- {a.content}
                                        {index < character.achievements.length - 1 && <br/>}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                        </>
                    ) : null}
                </Box>
            </CardContent>
        </Card>
    );
};

export default CharacterCard;