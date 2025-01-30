import { useDispatch } from "react-redux";
import { addNotification } from "../redux/store.ts";

export const useError = () => {
    const dispatch = useDispatch();

    return (code: string, message: string, details: string = '') => {
        dispatch(addNotification(
            {
                notificationCode: code,
                notificationMessage: message,
                notificationDetails: details,
                notificationType: "error"
            }
        ));
    };
};