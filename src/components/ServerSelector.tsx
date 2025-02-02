import { CircularProgress, MenuItem, TextField } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource.ts";
import {useError} from "../utils/setError.tsx";

const client = generateClient<Schema>();

interface ServerSelectorProps {
    value?: string;
    onChange?: (newServerId: string) => void;
}

export const ServerSelector: FC<ServerSelectorProps> = ({
                                                            value,
                                                            onChange,
                                                        }) => {
    const user = useSelector((state: RootState) => state.user);
    const [servers, setServers] = useState<Server[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const setError = useError();

    useEffect(() => {
        const fetchServers = async () => {
            try {
                setIsLoading(true);
                const { data, errors } = await client.models.Server.list({ authMode:user.authMode });

                if (errors) {
                    setError('#003:01', 'Помилка при отриманні списку змін', errors.length >0?errors[0]?.message:'')
                    console.error('Error fetching Servers:', errors);
                    return;
                }

                setServers([...data]);

                // Проверяем, есть ли сохраненный сервер в localStorage
                const savedServerId = localStorage.getItem('selectedServerId');
                if (savedServerId && data.some(server => server.id === savedServerId)) {
                    onChange?.(savedServerId);
                }
            } catch (error) {
                setError('#003:02', 'Помилка при отриманні списку змін', (error as Error).message)
                console.error('Error fetching servers:', error);
            } finally {
                setIsLoading(false);
            }
        };
        !isLoading && fetchServers();
    }, []);

    const handleServerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newServerId = event.target.value as string;
        onChange?.(newServerId);

        // Сохраняем выбранный сервер в localStorage
        localStorage.setItem('selectedServerId', newServerId);
    };

    if (isLoading || servers.length === 0) {
        return <CircularProgress />;
    }

    return (
        <TextField
            fullWidth
            select
            label="Зміна"
            value={value}
            onChange={handleServerChange}
            sx={{ minWidth: 200 }}
        >
            {servers.map(server => (
                <MenuItem key={server.id} value={server.id}>
                    {server.name}
                </MenuItem>
            ))}
        </TextField>
    );
};