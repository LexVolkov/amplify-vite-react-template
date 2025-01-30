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
            state.notificationCode = action.payload.notificationCode;
            state.notificationMessage = action.payload.notificationMessage;
            state.notificationDetails = action.payload.notificationDetails;
            state.notificationType = action.payload.notificationType;
        },
        clearNotification: () => initialState,
    },
});