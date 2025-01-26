// CharacterList.tsx
import { useState } from 'react';
import { ButtonGroup, Button, Skeleton } from '@mui/material';
import CharacterCard from './CharacterCard';
import FilterListIcon from '@mui/icons-material/FilterList';
const SORT_TYPES = {
    EXPERIENCE: 'experience',
    COINS: 'coins',
    NAME: 'name'
};
interface CharacterListProps {
    characters: Character;
    isLoading: boolean;
}

const CharacterList = ({characters, isLoading}: CharacterListProps) => {

    const [sortType, setSortType] = useState(SORT_TYPES.EXPERIENCE);

    const sortedCharacters = [...characters].sort((a, b) => {
        if (sortType === SORT_TYPES.EXPERIENCE) return b.experience - a.experience;
        if (sortType === SORT_TYPES.COINS) return b.coins - a.coins;
        return a.nickname.localeCompare(b.nickname);
    });

    return (
        <div>
            <ButtonGroup sx={{ m: 2 }}>
                <Button
                    variant={sortType === SORT_TYPES.EXPERIENCE ? 'contained' : 'outlined'}
                    onClick={() => setSortType(SORT_TYPES.EXPERIENCE)}
                >
                    {sortType === SORT_TYPES.EXPERIENCE && <FilterListIcon/>} Досвід
                </Button>
                <Button
                    variant={sortType === SORT_TYPES.COINS ? 'contained' : 'outlined'}
                    onClick={() => setSortType(SORT_TYPES.COINS)}
                >
                    {sortType === SORT_TYPES.COINS && <FilterListIcon/>} Монети
                </Button>
                <Button
                    variant={sortType === SORT_TYPES.NAME ? 'contained' : 'outlined'}
                    onClick={() => setSortType(SORT_TYPES.NAME)}
                >
                    {sortType === SORT_TYPES.NAME && <FilterListIcon/>} Нікнейм
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
                            place={i + 1}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
export default CharacterList;