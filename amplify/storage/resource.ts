import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'qc_rpg_assets',
    access: (allow) => ({
        'assets/*': [
            allow.guest.to(['read']),
            allow.groups(["GODS"]).to(['read', 'write', 'delete']),
            allow.authenticated.to(['read'])
        ],
    })
});