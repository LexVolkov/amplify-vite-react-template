import type {DynamoDBStreamHandler} from "aws-lambda";
import {env} from '$amplify/env/dynamoDB-function';
import {getAmplifyDataClientConfig} from "@aws-amplify/backend/function/runtime";
import {Amplify} from "aws-amplify";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../data/resource";

const {resourceConfig, libraryOptions} = await getAmplifyDataClientConfig(
    env
);
Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();


export const handler: DynamoDBStreamHandler = async (event) => {
    for (const record of event.Records) {
        if (record.eventName === "MODIFY") {
            const newImage = record.dynamodb?.NewImage;
            const oldImage = record.dynamodb?.OldImage;
            const charId = newImage?.id.S;
            console.log(`id: ${charId}`);

            const userProfileId = newImage?.userProfileId?.S;
            const oldUserProfileId = oldImage?.userProfileId?.S;

            console.log(`userProfileId: ${userProfileId}`);
            console.log(`oldUserProfileId: ${oldUserProfileId}`);

            if (userProfileId !== oldUserProfileId) {
                if (oldUserProfileId) {
                    const {data: subscriptions} = await client.models.CharSubscription.list({
                        filter: {
                            characterId: {eq: charId},
                            userProfileId: {eq: oldUserProfileId}
                        }
                    });

                    if (subscriptions.length > 0) {
                        const {errors} = await client.models.CharSubscription.delete(
                            {id: subscriptions[0].id}
                        );

                        if (errors) console.warn(errors[0]?.message || 'Помилка при видаленні підписки');

                    }
                }
                if (userProfileId) {
                    const {data: subscriptions} = await client.models.CharSubscription.list({
                        filter: {
                            characterId: {eq: charId},
                            userProfileId: {eq: userProfileId}
                        }
                    });
                    if (subscriptions.length === 0) {
                        const {errors} = await client.models.CharSubscription.create(
                            {characterId: charId, userProfileId: userProfileId}
                        );

                        if (errors) console.warn(errors[0]?.message || 'Помилка при запису підписки');
                    }
                }
                return {
                    batchItemFailures: [],
                };
            }
            const coins = newImage?.coins.N;
            const addCoins: number = Number(coins) - Number(oldImage?.coins.N);
            const charName = newImage?.nickname.S;
            const message = addCoins > 0
                ? `${charName} тільки що отримав ${addCoins} монет. Загалом ${coins}`
                : `${charName} тільки що загубив ${addCoins} монет. Загалом ${coins}`;

            const delay = 200;
            if (charId && addCoins !== 0) {
                const {data, errors} = await client.models.Character.get(
                    {id: charId},
                    {
                        selectionSet: ['charSubscription.userProfile.telegramId']
                    }
                );

                if (errors) console.warn(errors[0]?.message || 'Помилка при отриманні данних чара');

                if (data && data.charSubscription.length > 0) {
                    const subscriptions = data.charSubscription;
                    for (const subscription of subscriptions) {
                        await new Promise(resolve => setTimeout(resolve, delay));
                        client.queries.tgBotSendMessage({
                            message: message,
                            id: Number(subscription.userProfile.telegramId),
                        })
                    }
                }
                return {
                    batchItemFailures: [],
                };
            }
        }
    }
};