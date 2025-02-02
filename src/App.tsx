import Router from "./auth/routes.tsx";
import {Container} from "@mui/material";
import Footer from "./layots/Footer";
import Header from "./layots/Header.tsx";
import Notification from "./utils/Notification.tsx";

function App() {
    return (
        <main>
            <Notification/>
            <Header/>
            <Container maxWidth={'xl'} style={{padding: '10px'}}>
                <Router/>
            </Container>
            <Footer/>
        </main>
    );
}

export default App;
