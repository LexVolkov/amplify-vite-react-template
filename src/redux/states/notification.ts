import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const initialState: NotificationState = {
    notificationCode: null,
    notificationMessage: null,
    notificationDetails: null,
    notificationType: 'default',
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<NotificationState>) => {
            return {
                ...state,
                notificationCode: action.payload.notificationCode,
                notificationMessage: action.payload.notificationMessage,
                notificationDetails: action.payload.notificationDetails,
                notificationType: action.payload.notificationType,
            };
        },
        clearNotification: () => initialState,
    },
});