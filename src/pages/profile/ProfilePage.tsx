import React, { useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, setSignOut} from '../../redux/store.ts';
import {Box, Button, Tab, Tabs, Typography, Paper, Avatar, Container} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ProfileDetailsPage from "./widgets/ProfileDetailsPage.tsx";
import AssetIcon from "../../components/AssetIcon.tsx";
import ProfileCharactersPage from "./widgets/ProfileCharactersPage.tsx";
import ProfileSubscriptionPage from "./widgets/ProfileSubscriptionPage.tsx";
import {useSearchParams} from "react-router-dom";

// Отображение параметра URL в индекс вкладки
const tabMapping: { [key: string]: number } = {
    details: 0,
    characters: 1,
    subscription: 2,
};

// Обратное отображение: индекс вкладки → значение параметра URL
const reverseTabMapping: { [key: number]: string } = {
    0: 'details',
    1: 'characters',
    2: 'subscription',
};


function ProfilePage() {
    const user = useSelector((state: RootState) => state.user);
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTabParam = searchParams.get('tab');
    const initialTabIndex =
        initialTabParam && tabMapping[initialTabParam] !== undefined
            ? tabMapping[initialTabParam]
            : 0;
    const [value, setValue] = useState(initialTabIndex);
    const dispatch = useDispatch();




    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        console.log(event)
        setValue(newValue);
        setSearchParams({ tab: reverseTabMapping[newValue] });
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
                        {<AssetIcon fit={true}  assetId={user?.avatar}/>}
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
                    <Tab label="Підписки"/>
                </Tabs>

                <Box sx={{mt: 3}}>
                    {value === 0 && (
                        <ProfileDetailsPage/>
                    )}
                    {value === 1 && (
                        <ProfileCharactersPage/>
                    )}
                    {value === 2 && (
                        <ProfileSubscriptionPage />
                    )}
                </Box>
            </Paper>
        </Container>
    );
}

export default ProfilePage;