import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

export const m_listServers = async (requestData: any): Promise<Server[]> => {
    const { authMode, activeOnly } = requestData;
    if (!authMode) {
        throw new Error('Недостатньо даних для запиту');
    }

    const now = new Date().toISOString(); // Get current date in ISO format

    let filter = {};
    if (activeOnly) {
        filter = {
            startDate: { le: now }, // startDate <= now
            or: [{ endDate: { ge: now } }, { endDate: { eq: null } }] // endDate >= now OR endDate is null
        };
    }

    const { data, errors } = await client.models.Server.list({
        filter,
        authMode
    });

    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні даних');

    return data as Server[];
};
