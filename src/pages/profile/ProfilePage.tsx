import React, { useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, setSignOut} from '../../redux/store.ts';
import {Box, Button, Tab, Tabs, Typography, Paper, Avatar, Container} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ProfileDetailsPage from "./widgets/ProfileDetailsPage.tsx";
import AssetIcon from "../../components/AssetIcon.tsx";


function ProfilePage() {
    const user = useSelector((state: RootState) => state.user);
    const [value, setValue] = useState(0);
    const dispatch = useDispatch();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event)
        setValue(newValue);
    };

    const handleSignOut = () => {
        dispatch(setSignOut());
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
                        {<AssetIcon assetId={user?.avatar}/>}
                    </Avatar>
                    <Box>
                        <Typography variant="h5">{user?.nickname}</Typography>
                        <Typography variant="body2" color="textSecondary">{user?.fullName || ''}</Typography>
                        <Typography variant="body1" color="textSecondary">({user?.groups || 'Невідомо'})</Typography>
                    </Box>
                </Box>

                <Tabs value={value} onChange={handleChange} aria-label="profile tabs">
                    <Tab label="Акаунт"/>
                    <Tab label="Персонажі"/>
                    <Tab label="Статистика"/>
                </Tabs>

                <Box sx={{mt: 3}}>
                    {value === 0 && (
                        <ProfileDetailsPage/>
                    )}
                    {value === 1 && (
                        <Typography variant="body1">В розробці.</Typography>
                    )}
                    {value === 2 && (
                        <Typography variant="body1">В розробці.</Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

export default ProfilePage;