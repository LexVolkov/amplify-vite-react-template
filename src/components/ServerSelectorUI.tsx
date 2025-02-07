import {
    MenuItem,
    TextField,
    Chip,
    LinearProgress,
    useTheme,
    Box,
    Typography,
    keyframes
} from "@mui/material";
import React, { FC } from "react";
import { Bolt, Schedule, AccessTime } from "@mui/icons-material";

const pulse = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
`;

interface ServerSelectorUIProps {
    value?: string;
    onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
    isLoading?: boolean;
    servers: Server[] | [];
}

export const ServerSelectorUI: FC<ServerSelectorUIProps> = ({
                                                                value,
                                                                onChange,
                                                                isLoading,
                                                                servers = []}) => {
    const theme = useTheme();

    return (
        <TextField
            fullWidth
            select
            label={isLoading? 'Завантаження змін...' :"Оберіть зміну"}
            value={isLoading? '' : value}
            onChange={onChange}
            disabled={isLoading}
            sx={{
                '& .MuiOutlinedInput-root': {
                    borderRadius: '16px',
                    background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                    boxShadow: theme.shadows[4],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        boxShadow: theme.shadows[8],
                    },
                },
                '& .MuiSelect-icon': {
                    color: theme.palette.primary.main,
                    right: 12,
                }
            }}
            slotProps={{
                select: {
                    MenuProps: {
                        PaperProps: {
                            sx: {
                                borderRadius: '16px',
                                marginTop: 1,
                                background: theme.palette.background.paper,
                                boxShadow: theme.shadows[6],
                            }
                        }
                    }
                }
            }}
        >
            {servers.map(server => {
                const status = getServerStatus(server);
                const progress = getServerProgress(server);

                return (
                    <MenuItem
                        key={server.id}
                        value={server.id}
                        sx={{
                            minHeight: 72,
                            '&:hover': {
                                background: theme.palette.action.hover
                            },
                            '&.Mui-selected': {
                                background: `${theme.palette.primary.light}22`,
                            }
                        }}
                    >
                        <Box width="100%">
                            <Box display="flex" alignItems="center" gap={2}>
                                {status === 'active' ? (
                                    <Bolt sx={{
                                        color: theme.palette.success.main,
                                        fontSize: 32,
                                        animation: `${pulse} 2s infinite`
                                    }} />
                                ) : status === 'pending' ? (
                                    <AccessTime sx={{
                                        color: theme.palette.warning.main,
                                        fontSize: 32
                                    }} />
                                ) : (
                                    <Schedule sx={{
                                        color: theme.palette.text.secondary,
                                        fontSize: 32
                                    }} />
                                )}

                                <Box flexGrow={1}>
                                    <Typography
                                        variant="h6"
                                        color={status === 'completed' ? 'text.secondary' : 'text.primary'}
                                        sx={{ textShadow: status === 'active' ? `0 0 8px ${theme.palette.primary.light}40` : 'none' }}
                                    >
                                        {server.name}
                                        <Chip
                                            label={
                                                status === 'active' ? 'Активна' :
                                                    status === 'pending' ? 'Очікується' : 'Завершена'
                                            }
                                            size="small"
                                            sx={{
                                                ml: 1.5,
                                                bgcolor:
                                                    status === 'active' ? `${theme.palette.success.main}20` :
                                                        status === 'pending' ? `${theme.palette.warning.main}20` :
                                                            `${theme.palette.error.main}20`,
                                                color:
                                                    status === 'active' ? theme.palette.success.main :
                                                        status === 'pending' ? theme.palette.warning.main :
                                                            theme.palette.error.main
                                            }}
                                        />
                                    </Typography>

                                    <Typography variant="caption" color="text.secondary">
                                        {new Date(server.startDate).toLocaleDateString()} - {new Date(server.endDate).toLocaleDateString()}
                                    </Typography>
                                </Box>
                            </Box>

                            {status === 'active' && (
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        mt: 1,
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: `${theme.palette.primary.main}20`,
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 2,
                                            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                                        }
                                    }}
                                />
                            )}
                        </Box>
                    </MenuItem>
                );
            })}
        </TextField>
    );
};
const getServerStatus = (server: Server) => {
    const now = new Date();
    const start = new Date(server.startDate);
    const end = new Date(server.endDate);

    if (now < start) return 'pending';
    if (now <= end) return 'active';
    return 'completed';
};
const getServerProgress = (server: Server) => {
    const now = new Date().getTime();
    const start = new Date(server.startDate).getTime();
    const end = new Date(server.endDate).getTime();
    return ((now - start) / (end - start)) * 100;
};