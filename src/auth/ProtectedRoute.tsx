import {useDispatch, useSelector} from 'react-redux';
import {initialState, RootState, setUser} from '../redux/store.ts';
import {fetchAuthSession, getCurrentUser} from "aws-amplify/auth";
import {useEffect, ReactElement, useState} from "react";
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../amplify/data/resource.ts";
import NoAccessPage from "./NoAccessPage.tsx";
import {InitSettings} from "../utils/InitialSettings.ts";

interface ProtectedRouteProps {
    groups: string[];
    children: ReactElement;
}

const guest: string = 'GUEST';
const client = generateClient<Schema>();

const ProtectedRoute = ({groups, children}: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    const initializeUser = async () => {
        try {
            setIsLoading(true);

            const userData: UserState = {...initialState};

            const session = await fetchAuthSession();
            userData.identityId = session.identityId || null;
            if (session.tokens) {
                const currentUser = await getCurrentUser();
                userData.userId = currentUser.userId;
                userData.username = currentUser.username;
                const groups = session.tokens.accessToken.payload['cognito:groups'] || [];
                // Приведение к типу string[] с проверкой
                userData.groups = Array.isArray(groups) && groups.every(group => typeof group === 'string')
                    ? groups
                    : [];
                if (userData.groups.length === 0) {
                    userData.groups = ['NO GROUP'];
                }
                userData.authMode = 'userPool';
            } else {
                userData.groups = [guest];
                userData.authMode = 'identityPool';
            }
            if(userData.isAuth) {

                const {data, errors} = await client.models.UserProfile.list({});

                if (data && data.length > 0) {
                    const profile = data[0];
                    userData.avatar = profile.avatar;
                    userData.email = profile.email;
                    userData.fullName = profile.fullName;
                    userData.gender = profile.gender;
                    userData.nickname = profile.nickname;
                }
                if (errors) {
                    throw new Error(errors[0].message);
                }
            }
            InitSettings(userData.authMode, userData.groups).then();
            dispatch(setUser(userData));
        } catch (error) {
            console.error('Error fetching user data', error);
        }finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        initializeUser().then();
    }, []);

    if ((!user.username && !user.groups.includes(guest)) || isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3,
                    justifyContent: "center",
                }}
            >
                <CircularProgress size="5rem"/>
            </Box>
        )
    }

    if (!groups.some((group) => user.groups.includes(group))) {
        return <NoAccessPage></NoAccessPage>;
    }

    return children;
};

export default ProtectedRoute;
