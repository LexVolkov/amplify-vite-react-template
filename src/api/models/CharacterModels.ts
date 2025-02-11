import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

const defaultCharacterSelectionSet = [
    'id',
    'nickname',
    'coins',
    'experience',
    'level',
    'characterAvatar',
    'serverId',
    'achievements.*'
] as const;
export const m_listOwnCharacters = async (requestData: any): Promise<Character[]> => {
    const {userId} = requestData;
    if (!userId) {
        throw new Error('Не вистачає даних для запиту');
    }
    const {data, errors} = await client.models.Character.list(
            {
                filter: {
                    characterOwner: {
                        eq: userId + "::" + userId
                    }
                },
                selectionSet: [...defaultCharacterSelectionSet, 'server.name']
            },
        )
    ;
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    if (data) {
        return data as Character[];
    } else {
        return [];
    }
}
export const m_listSubscriptionCharacters = async (requestData: any): Promise<Character[]> => {
    const {serverId} = requestData;
    if (!serverId) {
        throw new Error('Не вистачає даних для запиту');
    }
    const {data, errors} = await client.models.Server.get(
        {id: serverId},
            {
                selectionSet: ['characters.id', 'characters.nickname', 'characters.characterAvatar', 'characters.charSubscription.*']
            },
        )
    ;
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    if (data) {
        return data.characters as Character[];
    } else {
        return [];
    }
}
export const m_listAdminSubscriptionCharacters = async (requestData: any): Promise<Character[]> => {
    const {serverId} = requestData;
    if (!serverId) {
        throw new Error('Не вистачає даних для запиту');
    }
    const {data, errors} = await client.models.Server.get(
            {id: serverId},
            {
                selectionSet: [
                    'characters.id',
                    'characters.nickname',
                    'characters.characterAvatar',
                    'characters.charSubscription.*',
                    'characters.charSubscription.userProfile.nickname',
                    'characters.charSubscription.userProfile.avatar',
                    'characters.charSubscription.userProfile.telegramId',
                    'characters.charSubscription.userProfile.telegramUsername',
                ]
            },
        )
    ;
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    if (data) {
        return data.characters as Character[];
    } else {
        return [];
    }
}
export const m_listCharacters = async (requestData: any): Promise<Character[]> => {
    const {serverId, authMode} = requestData;
    if (!serverId) {
        throw new Error('Не вистачає даних для запиту');
    }
    const {data, errors} = await client.models.Server.get(
        {id: serverId},
        {
            selectionSet: ['characters.*', 'characters.achievements.*'],
            authMode: authMode || "userPool"
        }
    );
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    if (data) {
        return data.characters as Character[];
    } else {
        return [];
    }
}
export const m_updateCharacter = async (requestData: any): Promise<Character[]> => {
    const {character} = requestData;
    if (!character) {
        throw new Error('Не має даних персонажа');
    }
    const {data, errors} = await client.models.Character.update(
        character, {
            selectionSet: defaultCharacterSelectionSet
        });
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    return data as Character;
}
export const m_createCharacter = async (requestData: any): Promise<Character[]> => {
    const {character} = requestData;
    if (!character) {
        throw new Error('Не має даних персонажа');
    }
    const newChar: Character = character;
    const {data, errors} = await client.models.Character.create(
        newChar
        , {
            selectionSet: defaultCharacterSelectionSet
        });

    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    return data as Character;
}
export const m_deleteCharacter = async (requestData: any): Promise<Character[]> => {
    const {id} = requestData;
    if (!id) {
        throw new Error('Не має даних персонажа');
    }

    const {data, errors} = await client.models.Character.delete({id}, {
        selectionSet: defaultCharacterSelectionSet
    });

    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    return data as Character;
}