import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';
import useRequest from '../../api/useRequest.ts';
import { m_listCharacters, m_updateCharacter } from '../../api/models/CharacterModels.ts';
import { m_createTransaction } from '../../api/models/TransactionModels.ts';
import { m_createAchievement } from '../../api/models/AchievementModels.ts';
import CharControlPageUI from './CharControlPageUI.tsx';
import { GlobalSettings } from '../../utils/DefaultSettings.ts';
import { useError } from '../../utils/setError.tsx';

type Transaction = {
    from: string;
    characterId: string;
    amount: number;
    reason: string;
};
interface CharControlPageProps {
    selectedServerId: string | null;
    searchQuery: string | '';
}
//TODO причина для добавления или отнимания?
export default function CharControlPage({selectedServerId, searchQuery}:CharControlPageProps) {
    const user = useSelector((state: RootState) => state.user);
    const [characters, setCharacters] = useState<Character[]>([]);
    const [transactionData, setTransactionData] = useState<Transaction | null>(null);
    const setError = useError();

    const charsData = useRequest({ model: m_listCharacters, errorCode: '#004:01' });
    const charsUpdate = useRequest({ model: m_updateCharacter, errorCode: '#004:02' });
    const addTransaction = useRequest({ model: m_createTransaction, errorCode: '#004:03' });
    const addAchievement = useRequest({ model: m_createAchievement, errorCode: '#004:04' });

    useEffect(() => {
        if (selectedServerId) {
            setCharacters([]);
            charsData.makeRequest({ serverId: selectedServerId }).then();
        }
    }, [selectedServerId]);

    useEffect(() => {
        if (charsData.result) {
            setCharacters(charsData.result);
        }
    }, [charsData.result]);

    const handleChangeCoin = async (character: Character, minus: boolean = false) => {
        const currentCoin: number = character.coins || 0;
        const coinsAdded: number = Number(GlobalSettings.CoinsAdded.value);
        const resultCoin: number = minus ? currentCoin - coinsAdded : currentCoin + coinsAdded;

        const currentExperience: number = character.experience || 0;
        const coinsExp: number = Number(GlobalSettings.CoinsExp.value);
        const resultExperience: number = minus ? currentExperience : currentExperience + (coinsAdded * coinsExp);

        const currentLevel: number = character.level || 1;
        const levelUpgradeExp: number = Number(GlobalSettings.LevelUpgradeExp.value);
        const resultLevel = resultExperience > 0 ? Math.floor(resultExperience / levelUpgradeExp) : currentLevel;

        const editChar = {
            ...character,
            coins: resultCoin,
            experience: resultExperience,
            level: resultLevel,
        };

        charsUpdate.makeRequest({ character: editChar }).then();

        setTransactionData({
            from: user?.userId || '',
            characterId: character.id,
            amount: minus ? -coinsAdded : coinsAdded,
            reason: 'Coins added',
        });
    };

    useEffect(() => {
        if (charsUpdate.result) {
            const charsUpdateResult: Character = charsUpdate.result;
            if (charsUpdateResult.id) {
                setCharacters((prev: Character[]) =>
                    prev.map((char: Character) => (char.id === charsUpdateResult.id ? charsUpdateResult : char))
                );
                addTransaction.makeRequest(transactionData).then();
            }
        }
    }, [charsUpdate.result]);

    const handleAddAchievement = async (character: Character) => {
        const promptNewAchievement = window.prompt(`Введіть досягнення для персонажа ${character.name}:`);
        const newAchievement = promptNewAchievement?.trim();
        if (newAchievement === '') {
            setError('#004:05', 'Введіть досягнення!');
            return;
        }
        addAchievement.makeRequest({
            from: user.userId,
            characterId: character.id,
            content: newAchievement,
        }).then();
    };

    useEffect(() => {
        if (addAchievement.result) {
            const AchievementAddResult: Character = addAchievement.result;
            setCharacters((prev: Character[]) =>
                prev.map((char: Character) =>
                    char.id === AchievementAddResult.characterId
                        ? { ...char, achievements: char.achievements.concat(AchievementAddResult) }
                        : char
                )
            );
        }
    }, [addAchievement.result]);

    const filteredCharacters = characters.filter(character =>
        character.nickname.toLowerCase().includes(searchQuery?.toLowerCase() || '')
    );

    return (
        <CharControlPageUI
            filteredCharacters={filteredCharacters}
            isLoading={charsData.isLoading}
            isLoadingUpdate={charsUpdate.isLoading}
            isLoadingAchievement={addAchievement.isLoading}
            handleChangeCoin={handleChangeCoin}
            handleAddAchievement={handleAddAchievement}
        />
    );
}