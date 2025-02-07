import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useRequest from "../api/useRequest.ts";
import {m_listServers} from "../api/models/ServerModels.ts";
import {ServerSelectorUI} from "./ServerSelectorUI.tsx";


interface ServerSelectorProps {
    value?: string;
    onChange?: (newServerId: string) => void;
}

export const ServerSelector: FC<ServerSelectorProps> = ({ value, onChange }) => {
    const user = useSelector((state: RootState) => state.user);
    const [servers, setServers] = useState<Server[]>([]);

    const serverData = useRequest({
        model: m_listServers,
        errorCode: '#003:01'
    });

    useEffect(() => {
        serverData.makeRequest({ authMode: user.authMode }).then()
    }, []);

    useEffect(() => {
        if(serverData.result){
            setServers(serverData.result);
            const savedServerId = localStorage.getItem('selectedServerId');
            if (savedServerId && serverData.result.some(server => server.id === savedServerId)) {
                onChange?.(savedServerId);
            }
        }
    }, [serverData.result]);

    const handleServerChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newServerId = event.target.value as string;
        onChange?.(newServerId);
        localStorage.setItem('selectedServerId', newServerId);
    };

    return (
        <ServerSelectorUI
            value={value}
            onChange={handleServerChange}
            isLoading={serverData.isLoading}
            servers={servers}
        />
    );
};