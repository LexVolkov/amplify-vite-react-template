// CharacterPage.tsx
import { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/data';
import {Box} from '@mui/material';
import CharacterList from "../../../components/CharacterList.tsx";
import type {Schema} from "../../../../amplify/data/resource.ts";
import {ServerSelector} from "../../../components/ServerSelector.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import {useError} from "../../../utils/setError.tsx";

const client = generateClient<Schema>();

export default function CharacterPage() {
    const user = useSelector((state: RootState) => state.user);
    const [selectedServerId, setSelectedServerId] = useState('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const setError = useError();

    useEffect(() => {
        if (selectedServerId) fetchCharacters().then();
    }, [selectedServerId]);

    const fetchCharacters = async () => {
        try {
            setIsLoading(true);


            const {data: characterData, errors} = await client.models.Server.get(
                {id: selectedServerId},
                {selectionSet: ['characters.*', 'characters.achievements.*'], authMode:user.authMode}
            );
            if (errors) {
                setError('#002:01', 'Помилка при отриманні списку персонажів', errors.length >0?errors[0]?.message:'')
                console.error('Error fetching Chars:', errors);
                return;
            }

            setCharacters(characterData?.characters || []);
        } catch (error) {
            setError('#002:02', 'Помилка при отриманні даних персонажів', (error as Error).message)
            console.error('Error fetching Chars:', error);
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
            {selectedServerId && (
                <CharacterList
                    characters={characters}
                    isLoading={isLoading}
                />
            )}
        </Box>
    );
}