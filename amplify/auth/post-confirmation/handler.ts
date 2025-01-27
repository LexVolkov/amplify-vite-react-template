import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import {
    CognitoIdentityProviderClient,
    AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { env } from '$amplify/env/post-confirmation';
import {getAmplifyDataClientConfig} from "@aws-amplify/backend/function/runtime";
import {Amplify} from "aws-amplify";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../data/resource";
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
    env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

const clientCognito = new CognitoIdentityProviderClient();

// add user to group
export const handler: PostConfirmationTriggerHandler = async (event) => {
    const command = new AdminAddUserToGroupCommand({
        GroupName: env.GROUP_NAME,
        Username: event.userName,
        UserPoolId: event.userPoolId
    });
    const response = await clientCognito.send(command);

    console.log('processed', response.$metadata.requestId);

    await client.models.UserProfile.create({
        email: event.request.userAttributes.email,
        profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
    });

    return event;
};