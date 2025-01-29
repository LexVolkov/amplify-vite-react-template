import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';

export const initialState: UserState = {
    userId: null,
    identityId: undefined,
    username: null,
    groups: [],
    isAuth: false,
    authMode: 'identityPool',
    avatar: null,
    email: null,
    fullName: null,
    gender: null,
    nickname: null,

};

const userSlice = createSlice({
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
        },
        clearUser: () => initialState,
    },
});
export const {setUser, clearUser} = userSlice.actions;
export const store = configureStore({
    reducer: {
        user: userSlice.reducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
