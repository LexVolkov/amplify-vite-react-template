import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";
import {useEffect} from "react";
import {enqueueSnackbar} from "notistack";

function Notification() {
    const notification = useSelector((state: RootState) => state.notification);
    useEffect(() => {
        if(notification.notificationMessage){
            const type = notification.notificationType;
            const details = notification.notificationDetails !== '' && notification.notificationDetails !== null ? ' ('+ notification.notificationDetails +')': '';
            const message = notification.notificationCode +': '+ notification.notificationMessage + details;
            enqueueSnackbar(message, {variant: type})
        }

    }, [notification]);
    return null;
}

export default Notification;
