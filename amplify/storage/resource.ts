import { defineStorage } from '@aws-amplify/backend';
const accessLevel = {
    guest:'GUEST',
    admin:'GODS',
    moder:'CURATORS',
    member:'KIDS'
}
export const storage = defineStorage({
    name: 'qc_rpg_assets',
    access: (allow) => ({
        'assets/*': [
            allow.guest.to(['read']),
            allow.groups([accessLevel.admin]).to(['read', 'write', 'delete']),
            allow.groups([accessLevel.moder, accessLevel.member]).to(['read']),
            allow.authenticated.to(['read'])
        ],
    })
});