import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

export const m_createAchievement = async (requestData:any): Promise<Character[]> => {
    const {from, characterId, content} = requestData;
    if(!from || !characterId || !content){
        throw new Error('Не вистачає даних');
    }
    const {data, errors} = await client.models.Achievement.create(
        {
            from: from,
            characterId: characterId,
            content: content
        }
    );

    if (errors) throw new Error(errors[0]?.message || 'Помилка при записі нового досягнення');
    return data as Achievement;
}
export const m_deleteAchievement = async (requestData:any): Promise<Character[]> => {
    const {id} = requestData;
    if(!id){
        throw new Error('Не вистачає даних');
    }
    const {data, errors} = await client.models.Achievement.delete({id});

    if (errors) throw new Error(errors[0]?.message || 'Помилка при записі нового досягнення');
    return data as Achievement;
}
export const m_updateAchievement = async (requestData:any): Promise<Character[]> => {
    const {id, content} = requestData;
    if(!id || !content){
        throw new Error('Не вистачає даних');
    }
    const {data, errors} = await client.models.Achievement.update({
        id: id,
        content: content,
    })
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних персонажів');
    return data as Achievement;
}