// CharacterPage.tsx
import { useEffect, useState } from 'react';
import {Box} from '@mui/material';
import CharacterList from "../../../components/CharacterList.tsx";
import {ServerSelector} from "../../../components/ServerSelector.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import Loader from "../../../components/Loader.tsx";
import useRequest from "../../../api/useRequest.ts";
import {m_listCharacters} from "../../../api/models/CharacterModels.ts";

export default function CharacterPage() {
    const user = useSelector((state: RootState) => state.user);
    const [selectedServerId, setSelectedServerId] = useState('');
    const [characters, setCharacters] = useState<Character[]>([]);

    const charsData = useRequest({
        model: m_listCharacters,
        errorCode: '#002:01'
    });

    useEffect(() => {
        if (selectedServerId) {
            setCharacters([]);
            charsData.makeRequest({ serverId: selectedServerId, authMode: user.authMode }).then();
        }
    }, [selectedServerId]);

    useEffect(() => {
        if (charsData.result) {
            setCharacters(charsData.result);
        }
    }, [charsData.result]);

    return (
        <Box sx={{ p: 3 }}>
            <ServerSelector
                value={selectedServerId}
                onChange={(serverId) => setSelectedServerId(serverId)}
            />
            {selectedServerId ? (
                <CharacterList
                    characters={characters}
                    isLoading={charsData.isLoading}
                />
            ):<Loader/>}
        </Box>
    );
}