// CharacterPage.tsx
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import {Alert, Box} from '@mui/material';
import CharacterList from "../../../components/CharacterList.tsx";
import type {Schema} from "../../../../amplify/data/resource.ts";
import {ServerSelector} from "../../../components/ServerSelector.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";

const client = generateClient<Schema>();

export default function CharacterPage() {
    const user = useSelector((state: RootState) => state.user);
    const [selectedServerId, setSelectedServerId] = useState('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (selectedServerId) fetchCharacters().then();
    }, [selectedServerId]);

    const fetchCharacters = async () => {

        try {
            setIsLoading(true);

            const {data: characterData} = await client.models.Server.get(
                {id: selectedServerId},
                {selectionSet: ['characters.*'], authMode:user.authMode}
            );

            setCharacters(characterData?.characters || []);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setError('Помилка при завантаженні персонаж.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <ServerSelector
                value={selectedServerId}
                onChange={(serverId) => setSelectedServerId(serverId)}
            />
            {error && (
                <Alert severity="error" sx={{mb: 2}} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {selectedServerId && (
                <CharacterList
                    characters={characters}
                    isLoading={isLoading}
                />
            )}
        </Box>
    );
}