// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SettingValueType =
    "string" |
    "number" |
    "boolean" |
    "asset" |
    "color" |
    null |
    undefined;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SettingRecord = {
    value: string;
    type: SettingValueType;
    order: number;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AccessLevel = {
    guest: string;
    admin: string;
    moder: string;
    member: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NotificationState {
    notificationCode: string | null;
    notificationMessage: string | null;
    notificationDetails: string | null;
    notificationType: 'default' | 'error' | 'success' | 'warning' | 'info';
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UserState {
    userId: string | null;
    identityId: string | null;
    username: string | null;
    groups: string[];
    isAuth: boolean;
    authMode: 'identityPool' | 'userPool';
    avatar: string | null;
    email: string | null;
    fullName: string | null;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | null ;
    nickname: string | null;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Asset = Schema["Asset"]["type"];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Tag = Schema["Tag"]["type"];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AssetCategory = Schema["AssetCategory"]["type"];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AssetSubCategory = Schema["AssetSubCategory"]["type"];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Server = Schema["Server"]["type"];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Character = Schema["Character"]["type"];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Setting = Schema["Setting"]["type"];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UserProfile = Schema["UserProfile"]["type"];
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Achievement = Schema["Achievement"]["type"];


