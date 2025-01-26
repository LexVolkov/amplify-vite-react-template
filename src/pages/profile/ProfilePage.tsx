import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {clearUser, RootState} from '../../redux/store.ts';
import {useAuthenticator} from '@aws-amplify/ui-react';
import {Box, Button, Tab, Tabs, Typography, Paper, Avatar, Container} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function ProfilePage() {
    const user = useSelector((state: RootState) => state.user);
    const {signOut} = useAuthenticator();
    const [value, setValue] = React.useState(0);
    const dispatch = useDispatch();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event, newValue)
        setValue(newValue);
    };
    const handleSignOut = () => {
        dispatch(clearUser());
        signOut();
    };
    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{p: 4, mt: 4, borderRadius: 2}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4}}>
                    <Typography variant="h4" component="h1">
                        Профіль
                    </Typography>
                    <Button variant="contained" onClick={handleSignOut} endIcon={<LogoutIcon/>}>
                        Вийти
                    </Button>
                </Box>

                <Box sx={{display: 'flex', alignItems: 'center', mb: 4}}>
                    <Avatar sx={{width: 100, height: 100, mr: 3}}>
                        {/* Здесь можно добавить аватар пользователя */}
                        {user?.username?.charAt(0)}
                    </Avatar>
                    <Box>
                        <Typography variant="h5">{user?.username}</Typography>
                        <Typography variant="body1" color="textSecondary">Група: {user?.groups}</Typography>
                        <Typography variant="body1" color="textSecondary">ID: {user?.userId}</Typography>
                    </Box>
                </Box>

                <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
                    <Tab label="Акаунт"/>
                    <Tab label="Персонажі"/>
                    <Tab label="Статистика"/>
                    <Tab label="Безпека"/>
                </Tabs>

                <Box sx={{mt: 3}}>
                    {value === 0 && (
                        <Typography variant="body1">В розробці.</Typography>
                    )}
                    {value === 1 && (
                        <Typography variant="body1">В розробці.</Typography>
                    )}
                    {value === 2 && (
                        <Typography variant="body1">В розробці.</Typography>
                    )}
                    {value === 3 && (
                        <Typography variant="body1">В розробці.</Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

export default ProfilePage;