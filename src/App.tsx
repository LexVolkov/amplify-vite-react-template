import Router from "./auth/routes.tsx";
import { Container} from "@mui/material";
import Footer from "./layots/Footer";
import Header from "./layots/Header.tsx";

function App() {

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
