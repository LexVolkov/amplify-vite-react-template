import {Chip, Divider, Link, Paper} from "@mui/material";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";

const Footer = () => {
    return (
        <Paper elevation={1}>
            <Container maxWidth="xl">
                <Toolbar style={{justifyContent: "center"}}>
                    <Stack direction="row"
                           divider={<Divider orientation="vertical" flexItem/>}
                           spacing={2}
                    >
                        <Chip label={"QCRPS v0.01"} variant="outlined"/>
                        <Link href="https://t.me/+R61MPkPpiMw1MzJi" color="inherit">
                            <Chip label={'Questy Camp'} variant="outlined"/>
                        </Link>
                        <Link href="https://t.me/Lex_Volkov" color="inherit">
                            <Chip label={'Lex Volkov ©'} variant="outlined"/>
                        </Link>
                    </Stack>
                </Toolbar>
            </Container>
        </Paper>
    );
};

export default Footer;