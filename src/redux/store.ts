import {configureStore} from '@reduxjs/toolkit';
import {userSlice} from "./states/user.ts";
import {notificationSlice} from "./states/notification.ts";

export const {setUser, clearUser, setSignOut} = userSlice.actions;
export const {addNotification, clearNotification} = notificationSlice.actions;
export const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        notification: notificationSlice.reducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
