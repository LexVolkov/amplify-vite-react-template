import Router from "./auth/routes.tsx";
import { Container} from "@mui/material";
import Footer from "./layots/Footer";
import Header from "./layots/Header.tsx";
import {useSelector} from "react-redux";
import {RootState} from "./redux/store.ts";
import {useEffect} from "react";
import {enqueueSnackbar} from "notistack";

function App() {
    const notification = useSelector((state: RootState) => state.notification);
    useEffect(() => {
        if(notification.notificationMessage){
            const type = notification.notificationType;
            const message = notification.notificationCode +': '+ notification.notificationMessage +' ('+notification.notificationDetails+')';
            //console.log(`error: ${message} info: ${notification.notificationDetails}`)
            enqueueSnackbar(message, {variant: type})
        }

    }, [notification]);
    return (
        <main>
            <Header/>
            <Container maxWidth={'xl'} style={{padding: '10px'}}>
                <Router/>
            </Container>
            <Footer/>
        </main>
    );
}

export default App;
