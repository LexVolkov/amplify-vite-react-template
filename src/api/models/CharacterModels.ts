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
export const m_listCharacters = async (requestData:any): Promise<Character[]> => {
    const {serverId, authMode} = requestData;
    if(!serverId){
        throw new Error('Не вистачає даних для запиту');
    }
    const {data, errors} = await client.models.Server.get(
        {id: serverId},
        {selectionSet: ['characters.*', 'characters.achievements.*'], authMode:authMode || "userPool"}
    );
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    if(data){
        return data.characters as Character[];
    }else{
        return [];
    }
}
export const m_updateCharacters = async (requestData:any): Promise<Character[]> => {
    const {character} = requestData;
    if(!character){
        throw new Error('Не має даних персонажа');
    }
    const {data, errors} = await client.models.Character.update(
        character,{
            selectionSet: defaultCharacterSelectionSet
        });
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    return data as Character;
}