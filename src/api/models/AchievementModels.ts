import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

export const m_createAchievement = async (requestData:any): Promise<Character[]> => {
    const {from, characterId, content} = requestData;
    if(!from || !characterId || !content){
        throw new Error('Не вистачає даних для запису логів');
    }
    const {data, errors} = await client.models.Achievement.create(
        {
            from: from,
            characterId: characterId,
            content: content
        }
    );
    console.log(data, errors)
    if (errors) throw new Error(errors[0]?.message || 'Помилка при записі нового досягнення');
    return data as Achievement;
}