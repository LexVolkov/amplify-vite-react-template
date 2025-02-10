import type {Schema} from "../resource"
import {env} from "$amplify/env/manage-user"
import {
    AdminAddUserToGroupCommand,
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminUserGlobalSignOutCommand,
    AdminDisableUserCommand,
    AdminEnableUserCommand
} from "@aws-sdk/client-cognito-identity-provider"

type Handler = Schema["manageUser"]["functionHandler"]
const client = new CognitoIdentityProviderClient()

export const handler: Handler = async (event) => {
    const {userId, groupName, ban} = event.arguments

    if (userId) {
        if (groupName) {
            const command = new AdminAddUserToGroupCommand({
                Username: userId,
                GroupName: groupName,
                UserPoolId: env.USER_POOL_ID,
            })
            return await client.send(command)

        }
        if (ban === true) {
            const command = new AdminDisableUserCommand({
                UserPoolId: env.USER_POOL_ID,
                Username: userId,
            })
            const response = await client.send(command)

            const command2 = new AdminUserGlobalSignOutCommand({
                UserPoolId: env.USER_POOL_ID,
                Username: userId,
            })
            const response2 = await client.send(command2)

            if (response2.$metadata.httpStatusCode === 200 && response.$metadata.httpStatusCode === 200){
                return {id: userId, banned: true}
            }else{
                return {error: 'Server error'}
            }
        } else if (ban === false) {
            const command = new AdminEnableUserCommand({
                UserPoolId: env.USER_POOL_ID,
                Username: userId,
            })
            const response = await client.send(command)
            if (response.$metadata.httpStatusCode === 200){
                return {id: userId, banned: false}
            }else{
                return {error: 'Server error'}
            }
        } else {
            return {error: 'Invalid ban value'}
        }
    } else {
        const command = new ListUsersCommand({
            UserPoolId: env.USER_POOL_ID,
        })
        const response = await client.send(command)
        if (!response.Users || response.Users.length === 0) {
            return {error: 'No userProfiles found'}
        }
        const userBans = response.Users.map(
            user => {
                return {
                    id: user.Username,
                    banned: !user.Enabled
                }
            })
        if(userBans){
            return userBans
        }else{
            return {error: 'No userProfiles found'}
        }
    }
}