import {defineAuth} from '@aws-amplify/backend';
import {postConfirmation} from "./post-confirmation/resource"
import {apiFunction} from "../functions/api-function/resource";
import {manageUser} from "../data/manage-user/resource";


export const auth = defineAuth({
    loginWith: {
        email: true,
    },
    groups: ["GODS", "CURATORS", "KIDS"],
    triggers: {
        postConfirmation,
    },
    access: (allow) => [
        allow.resource(postConfirmation).to(["addUserToGroup"]),
        allow.resource(apiFunction).to(["getUser"]),
        allow.resource(apiFunction).to(["createUser"]),
        allow.resource(apiFunction).to(["managePasswordRecovery"]),
        allow.resource(apiFunction).to(["addUserToGroup"]),
        allow.resource(manageUser).to(["manageGroupMembership"]),
        allow.resource(manageUser).to(["manageUsers"]),
        allow.resource(manageUser).to(["listUsers"]),
    ],
});
