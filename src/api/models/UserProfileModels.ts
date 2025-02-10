import {generateClient} from "aws-amplify/api";
import {Schema} from "../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

export const m_getUserProfileData = async (requestData:any): Promise<Character[]> => {

    const {userId} = requestData;
    if(!userId){
        throw new Error('Недостатньо даних для запиту');
    }
    const {data, errors} = await client.models.UserProfile.list({
        filter: {
            profileOwner: {
                eq: userId+"::"+userId
            }
        }
    });

    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних профелю');
    if(data && data.length > 0){
        return data[0] as UserProfile;
    }else{
        return [];
    }
}
export const m_listUsersProfileData = async (): Promise<Character[]> => {

    const {data, errors} = await client.models.UserProfile.list({});

    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних профелю');
    if(data){
        return data as UserProfile;
    }else{
        return [];
    }
}
export const m_listUsersData = async (): Promise<UserProfile> => {

    const {data, errors} = await client.models.UserProfile.list({});

    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних профелю');

    const {data:dataUser, errors:errorsUser} = await client.mutations.manageUser({})

    if (errorsUser) throw new Error(errorsUser[0]?.message || 'Помилка при отриманні данних користувачів');

    const usersBaned = dataUser?JSON.parse(dataUser.toString()):{};

    return {data:data as UserProfile, usersBaned};
}
export const m_updateUsersProfileData = async (requestData:any): Promise<Character[]> => {
    const {user} = requestData;
    if(!user){
        throw new Error('Недостатньо даних для запиту');
    }
    const {data, errors} = await client.models.UserProfile.update(user);
    if (errors) throw new Error(errors[0]?.message || 'Помилка при отриманні данних користувачів');
    return data as Character;
}
export const m_mutationUserBanned = async (requestData:any): Promise<UserProfile> => {
    const {userId, profileOwner, doBanned} = requestData;
    if(!userId || !profileOwner || doBanned === undefined){
        throw new Error('Недостатньо даних для запиту');
    }
    const {data, errors} = await client.mutations.manageUser({
        userId:profileOwner,
        ban:doBanned
    })

    if (errors) throw new Error(errors[0]?.message || 'Помилка при бані користувача');

    const usersBanedResult = data?JSON.parse(data.toString()):{};

    if(usersBanedResult && usersBanedResult.error){
        throw new Error(usersBanedResult.error);
    }
    if(usersBanedResult){
        const {data, errors} = await client.models.UserProfile.update(
            {
                id:userId,
                banned: doBanned,
                bannedReason: doBanned ? 'Забанений адміністрацією': '',
                bannedTime: doBanned ? Date.now().toString(): '',
            }
        );
        if (errors) throw new Error(errors[0]?.message || 'Помилка при бані користувача');
        return {data:data as UserProfile, usersBanedResult};
    }else{
        throw new Error(usersBanedResult.message);
    }
}