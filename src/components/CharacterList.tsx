import { useState } from 'react';
import { ButtonGroup, Button, Skeleton } from '@mui/material';
import CharacterCard from './CharacterCard';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const SORT_TYPES = {
    EXPERIENCE: 'experience',
    COINS: 'coins',
    NAME: 'name'
};

interface CharacterListProps {
    characters: Character[];
    isLoading?: boolean;
    isServerName?: boolean;
}

const CharacterList = ({ characters, isLoading, isServerName }: CharacterListProps) => {
    const [sortType, setSortType] = useState(SORT_TYPES.EXPERIENCE);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const handleSortChange = (type: string) => {
        if (sortType === type) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortType(type);
            setSortOrder(type === SORT_TYPES.NAME ? 'asc' : 'desc');
        }
    };

    const sortedCharacters = [...characters].sort((a, b) => {
        let comparison = 0;

        if (sortType === SORT_TYPES.EXPERIENCE) {
            comparison = b.experience - a.experience;
        } else if (sortType === SORT_TYPES.COINS) {
            comparison = b.coins - a.coins;
        } else {
            comparison = a.nickname.localeCompare(b.nickname);
        }

        return sortOrder === 'desc' ? comparison : -comparison;
    });

    return (
        <div>
            <ButtonGroup sx={{ m: 2 }}>
                <Button
                    variant={sortType === SORT_TYPES.EXPERIENCE ? 'contained' : 'outlined'}
                    onClick={() => handleSortChange(SORT_TYPES.EXPERIENCE)}
                >
                    {sortType === SORT_TYPES.EXPERIENCE &&
                        (sortOrder==='asc'
                            ?<KeyboardDoubleArrowUpIcon />:
                         <KeyboardDoubleArrowDownIcon />)} Досвід
                </Button>
                <Button
                    variant={sortType === SORT_TYPES.COINS ? 'contained' : 'outlined'}
                    onClick={() => handleSortChange(SORT_TYPES.COINS)}
                >
                    {sortType === SORT_TYPES.COINS &&
                        (sortOrder==='asc'
                            ?<KeyboardDoubleArrowUpIcon />:
                            <KeyboardDoubleArrowDownIcon />)} Монети
                </Button>
                <Button
                    variant={sortType === SORT_TYPES.NAME ? 'contained' : 'outlined'}
                    onClick={() => handleSortChange(SORT_TYPES.NAME)}
                >
                    {sortType === SORT_TYPES.NAME &&
                        (sortOrder==='desc'
                            ?<KeyboardDoubleArrowUpIcon />:
                            <KeyboardDoubleArrowDownIcon />)} Нікнейм
                </Button>
            </ButtonGroup>

            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                        <Skeleton key={i} variant="rounded" width={250} height={150} sx={{ m: 2 }} />
                    ))
                ) : (
                    sortedCharacters.map((character, i) => (
                        <CharacterCard
                            key={character.id}
                            character={character}
                            place={sortType === SORT_TYPES.NAME? undefined : i + 1}
                            isServerName={isServerName}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default CharacterList;
