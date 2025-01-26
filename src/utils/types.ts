

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AccessLevel = {
    guest: string;
    admin: string;
    moder: string;
    member: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface UserState {
    userId: string | null;
    username: string | null;
    groups: string[];
    isAuth: boolean;
    authMode: 'identityPool' | 'userPool';
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


