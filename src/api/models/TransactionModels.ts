import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

export const m_createTransaction = async (requestData:any): Promise<Character[]> => {
    const {from, characterId, amount, reason} = requestData;
    if(!from || !characterId || !amount || !reason){
        throw new Error('Не вистачає даних для запису логів');
    }
    const {data, errors} = await client.models.Transaction.create(
        {
            from: from,
            characterId: characterId,
            amount: amount,
            reason: reason,
        }
        );
    if (errors) throw new Error(errors[0]?.message || 'Помилка при записі логів');
    return data as Transaction;
}