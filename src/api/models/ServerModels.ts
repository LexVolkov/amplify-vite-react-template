import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

export const m_listServers = async (requestData:any): Promise<Character[]> => {
    const {authMode} = requestData;
    if(!authMode){
        throw new Error('Недостатньо даних для запиту');
    }
    const { data, errors } = await client.models.Server.list({
        authMode: authMode
    });

    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних змін');
    return data as Server[];
}