import {type ClientSchema, a, defineData} from "@aws-amplify/backend";
import {postConfirmation} from "../auth/post-confirmation/resource";
import {telegramBot} from "../functions/telegram-bot/resource";

const accessLevel = {
    guest: 'GUEST',
    admin: 'GODS',
    moder: 'CURATORS',
    member: 'KIDS'
}

const schema = a.schema({
    Character: a
        .model({
            owner: a.id(),
            nickname: a.string().required(),
            coins: a.integer(),
            experience: a.integer(),
            level: a.integer(),
            characterAvatar: a.string(),
            serverId: a.id(),
            server: a.belongsTo('Server', 'serverId'),
            transactions: a.hasMany('Transaction', 'characterId'),
            achievements: a.hasMany('Achievement', 'characterId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder]).to(["read", "update"]),
            allow.groups([accessLevel.member]).to(["read"]),
            allow.owner().to(["read", "update"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),

    Achievement: a
        .model({
            from: a.id(),
            characterId: a.id(),
            content: a.string(),
            character: a.belongsTo('Character', 'characterId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder]).to(["read", "update"]),
            allow.groups([accessLevel.member]).to(["read"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),

    Server: a
        .model({
            name: a.string().required(),
            startDate: a.string(),
            endDate: a.string(),
            characters: a.hasMany('Character', 'serverId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder, accessLevel.member]).to(["read"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),

    Transaction: a
        .model({
            from: a.string().required(),
            characterId: a.string().required(),
            amount: a.integer().required(),
            reason: a.string(),
            character: a.belongsTo('Character', 'characterId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder]).to(["create"]),
        ]),
    UserProfile: a
        .model({
            email: a.string(),
            profileOwner: a.string(),
            fullName: a.string(),
            nickname: a.string(),
            avatar: a.string(),
            gender: a.enum(['MALE', 'FEMALE', 'OTHER'])
        })
        .authorization((allow) => [
            allow.ownerDefinedIn("profileOwner"),
        ]),
    Settings: a
        .model({
            name: a.string().required(),
            type: a.enum(["string", "number", "asset", "color", "boolean"]),
            value: a.string(),
            description: a.string(),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder, accessLevel.member]).to(["read"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),


    Asset: a
        .model({
            path: a.string(),
            name: a.string(),
            description: a.string(),
            subCategoryId: a.id().required(),
            subCategory: a.belongsTo('AssetSubCategory', 'subCategoryId'),
            tags: a.hasMany('AssetTag', 'assetId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder, accessLevel.member]).to(["read"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),
    Tag: a
        .model({
            name: a.string().required(),
            description: a.string(),
            assets: a.hasMany('AssetTag', 'tagId'),
        }).authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder, accessLevel.member]).to(["read"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),
    AssetTag: a
        .model({
            assetId: a.id().required(),
            tagId: a.id().required(),
            asset: a.belongsTo('Asset', 'assetId'),
            tag: a.belongsTo('Tag', 'tagId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder, accessLevel.member]).to(["read"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),
    AssetCategory: a
        .model({
            name: a.string().required(),
            subCategory: a.hasMany('AssetSubCategory', 'categoryId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder, accessLevel.member]).to(["read"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),
    AssetSubCategory: a
        .model({
            name: a.string().required(),
            categoryId: a.id(),
            category: a.belongsTo('AssetCategory', 'categoryId'),
            assets: a.hasMany('Asset', 'subCategoryId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder, accessLevel.member]).to(["read"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),
    telegramBot: a
        .query()
        .arguments({
            name: a.string(),
        })
        .returns(a.string())
        .handler(a.handler.function(telegramBot))
        .authorization((allow) => [
            allow.authenticated(),
        ]),


}).authorization((allow) => [
    allow.resource(postConfirmation),
    allow.resource(telegramBot)
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
    name: "QC_RPG_API",
    schema,
    authorizationModes: {
        defaultAuthorizationMode: "userPool",
        apiKeyAuthorizationMode: {
            expiresInDays: 30,
        },
    },
});
