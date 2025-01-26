import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {accessLevel} from "../utils/AccessLevel.tsx";



interface SettingsObject {
    [key: string]: Setting;
}

interface GameState {
    settings: SettingsObject;
}

const initialState: UserState = {
    userId: null,
    username: null,
    groups: [],
    isAuth: false,
    authMode: 'identityPool',
};
const initialGameState: GameState = {
    settings: {},
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserState>) => {
            state.userId = action.payload.userId;
            state.username = action.payload.username;
            state.groups = action.payload.groups;
            state.isAuth = true;
            state.authMode =  action.payload.groups.includes(accessLevel.guest) ? 'identityPool' : 'userPool';

        },
        clearUser: (state) => {
            state.userId = null;
            state.username = null;
            state.groups = [];
            state.isAuth = false;
            state.authMode = 'identityPool';
        },
    },
});
const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        setSettings: (state, action: PayloadAction<SettingsObject>) => {
            state.settings = action.payload;
        },
    },
});
export const { setUser, clearUser } = userSlice.actions;
export const { setSettings } = gameSlice.actions;
export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        game: gameSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
