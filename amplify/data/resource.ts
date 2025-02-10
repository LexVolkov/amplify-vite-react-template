import {type ClientSchema, a, defineData} from "@aws-amplify/backend";
import {postConfirmation} from "../auth/post-confirmation/resource";
import {tgBotSendMessage} from "../functions/tg-bot-send-message/resource";
import {apiFunction} from "../functions/api-function/resource";
import {manageUser} from "./manage-user/resource";

const accessLevel = {
    guest: 'GUEST',
    admin: 'GODS',
    moder: 'CURATORS',
    member: 'KIDS'
}

const schema = a.schema({
    Character: a
        .model({
            characterOwner: a.string(),
            userProfileId: a.id(),
            nickname: a.string().required(),
            coins: a.integer(),
            experience: a.integer(),
            level: a.integer(),
            characterAvatar: a.string(),
            serverId: a.id(),
            server: a.belongsTo('Server', 'serverId'),
            userProfile: a.belongsTo('UserProfile', 'userProfileId'),
            transactions: a.hasMany('Transaction', 'characterId'),
            achievements: a.hasMany('Achievement', 'characterId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "create", "update", "delete"]),
            allow.groups([accessLevel.moder]).to(["read", "update"]),
            allow.groups([accessLevel.member]).to(["read"]),
            allow.ownerDefinedIn("characterOwner").to(["read", "update"]),
            allow.guest().to(["read"]),
            allow.authenticated().to(["read"]),
        ]),
    UserProfile: a
        .model({
            email: a.string(),
            profileOwner: a.string(),
            fullName: a.string(),
            nickname: a.string(),
            avatar: a.string(),
            gender: a.enum(['MALE', 'FEMALE', 'OTHER']),
            telegramId: a.integer(),
            telegramUsername: a.string(),
            banned: a.boolean().default(false),
            bannedReason: a.string(),
            bannedTime: a.string(),
            characters: a.hasMany('Character', 'userProfileId'),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin]).to(["read", "update", "delete"]),
            allow.ownerDefinedIn("profileOwner"),
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
    tgBotSendMessage: a
        .query()
        .arguments({
            message: a.string(),
            id: a.integer(),
        })
        .returns(a.string())
        .handler(a.handler.function(tgBotSendMessage))
        .authorization((allow) => [
            allow.groups([accessLevel.admin, accessLevel.moder])
        ]),
    manageUser: a
        .mutation()
        .arguments({
            userId: a.string(),
            groupName: a.string(),
            ban: a.boolean(),
        })
        .authorization((allow) => [
            allow.groups([accessLevel.admin])
        ])
        .handler(a.handler.function(manageUser))
        .returns(a.json()),


}).authorization((allow) => [
    allow.resource(postConfirmation),
    allow.resource(tgBotSendMessage),
    allow.resource(apiFunction),
    allow.resource(manageUser),
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
