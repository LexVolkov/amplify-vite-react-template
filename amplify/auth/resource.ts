import {defineAuth} from '@aws-amplify/backend';
import {postConfirmation} from "./post-confirmation/resource"


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
    ],
});
