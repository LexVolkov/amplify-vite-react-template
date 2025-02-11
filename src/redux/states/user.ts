import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const initialState: UserState = {
    userId: null,
    identityId: null,
    username: null,
    groups: [],
    isAuth: false,
    authMode: 'identityPool',
    avatar: null,
    email: null,
    fullName: null,
    gender: null,
    nickname: null,
    banned: false,
    signOut: false,
    userProfileId: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.userId = action.payload.userId;
            state.identityId = action.payload.identityId;
            state.username = action.payload.username;
            state.groups = action.payload.groups;
            state.isAuth = true;
            state.authMode = action.payload.authMode;
            state.avatar = action.payload.avatar;
            state.email = action.payload.email;
            state.fullName = action.payload.fullName;
            state.gender = action.payload.gender;
            state.nickname = action.payload.nickname;
            state.userProfileId = action.payload.userProfileId;
        },
        clearUser: () => initialState,
        setSignOut: (state) => {
            state.signOut = true;
        },
    },
});