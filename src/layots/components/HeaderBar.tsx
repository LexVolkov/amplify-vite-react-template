import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import ToggleThemeMode from "../theme/ToggleThemeMode.tsx";
import HeaderLogo from "../theme/HeaderLogo.tsx";
import UserBar from "./UserBar.tsx";
function HeaderBar() {
    return (
        <AppBar position="static" color="inherit" >
            <Container maxWidth="xl">
                <Toolbar style={{ justifyContent: 'space-between' }} variant="dense">
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' },alignItems: 'center' }}>
                        <HeaderLogo/>
                    </Box>
                    <Box sx={{ flexGrow: 0, display: { xs: 'flex', md: 'flex' },alignItems: 'center' }}>
                        <UserBar />
                        <ToggleThemeMode />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default HeaderBar;