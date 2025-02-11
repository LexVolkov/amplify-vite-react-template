import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

export const m_setSubscription = async (requestData: any): Promise<any> => {
    const {characterId} = requestData;
    if (!characterId) {
        throw new Error('Не вистачає даних для запиту');
    }
    const {data, errors} = await client.mutations.subscriptionManager({
        characterId: characterId,
        del: false
    });
    const result = data?JSON.parse(data.toString()):{};
    const {data: subscription, errors: subscriptionErrors} = result;
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні відповіді на сервері');
    if (subscriptionErrors) throw new Error(subscriptionErrors[0]?.message || 'Помилка при отриманні відповіді на сервері');

    if (subscription) {
        return subscription;
    } else {
        return [];
    }
}
export const m_setUnSubscription = async (requestData: any): Promise<any> => {
    const {characterId} = requestData;
    if (!characterId) {
        throw new Error('Не вистачає даних для запиту');
    }
    const {data, errors} = await client.mutations.subscriptionManager({
        characterId: characterId,
        del: true
    });

    const results = data?JSON.parse(data.toString()) : {};

    const {data: subscription, errors: subscriptionErrors} = results;
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні відповіді на сервері');
    if (subscriptionErrors) throw new Error(subscriptionErrors[0]?.message || 'Помилка при отриманні відповіді на сервері');

    if (subscription) {
        return subscription;
    } else {
        return [];
    }
}