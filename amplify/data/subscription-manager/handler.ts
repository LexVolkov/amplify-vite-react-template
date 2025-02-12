
import {env} from "$amplify/env/subscription-manager"
import {getAmplifyDataClientConfig} from "@aws-amplify/backend/function/runtime";
import {Amplify} from "aws-amplify";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../resource";
import {AppSyncIdentityCognito} from "aws-lambda";

const {resourceConfig, libraryOptions} = await getAmplifyDataClientConfig(
    env
);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();


export const handler: Schema["subscriptionManager"]["functionHandler"] = async (event) => {
    const { characterId, del } = event.arguments
    const {sub, username} = (event.identity as AppSyncIdentityCognito);

    if(characterId === null || username === null){
        return {
            data: false,
            errors: [{message: 'Не вдалося отримати дані про користувача'}]
        }
    }

    const {data: userProfile} = await client.models.UserProfile.list({
        filter: {
            profileOwner: {eq: sub+'::'+username}
        }
    });

    if(del){
        if(characterId && userProfile.length > 0){
            const {data: subscriptions} = await client.models.CharSubscription.list({
                filter: {
                    characterId: {eq: characterId},
                    userProfileId: {eq: userProfile[0].id}
                }
            });

            const {data, errors} = await client.models.CharSubscription.delete(
                {id: subscriptions[0].id}
            );

            if (errors){
                console.warn(errors[0]?.message || 'Помилка при видаленні підписки');
                return {
                    data: false,
                    errors
                }
            }
            return {data, errors};
        }else{
            return {
                data: false,
                errors: [{message:'Помилка при видаленні підписки'}]
            }
        }

    }else{
        const {data, errors} = await client.models.CharSubscription.create(
            {
                characterId: characterId,
                userProfileId: userProfile[0].id
            }
        );
        if (errors) {
            console.warn(errors[0]?.message || 'Помилка при створенні підписки');
            return {
                data: false,
                errors
            }
        }
        return {data, errors};
    }
};