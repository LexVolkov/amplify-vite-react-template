import {useDispatch, useSelector} from 'react-redux';
import {RootState, setSettings, setUser} from '../redux/store.ts';
import {fetchAuthSession, getCurrentUser} from "aws-amplify/auth";
import {useEffect, ReactElement} from "react";
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../amplify/data/resource.ts";
import NoAccessPage from "./NoAccessPage.tsx";

interface ProtectedRouteProps {
    groups: string[];
    children: ReactElement;
}
const guest:string = 'GUEST';
const client = generateClient<Schema>();
type Nullable<T> = T | null;
interface Setting {
    id: string;
    name: string;
    value: Nullable<string>;
    description: Nullable<string>;
    createdAt: string;
    updatedAt: string;
}

interface SettingsObject {
    [key: string]: Setting;
}
const ProtectedRoute = ({ groups, children }: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.user);
    const game = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();

    const initializeUser = async () => {
        try {
            const userData: UserState = {
                userId: '',
                username: '',
                groups: [],
                isAuth: false,
                authMode: 'identityPool'
            };

            const session = await fetchAuthSession();
            if (session.tokens) {
                const currentUser = await getCurrentUser();
                userData.userId = currentUser.userId;
                userData.username = currentUser.username;
                const groups = session.tokens.accessToken.payload['cognito:groups'] || [];
                // Приведение к типу string[] с проверкой
                userData.groups = Array.isArray(groups) && groups.every(group => typeof group === 'string')
                    ? groups
                    : [];
            }else{
                userData.groups = [guest];
            }
            dispatch(setUser(userData));

        } catch (error) {
            console.error('Error fetching user data', error);
        }
    };

    useEffect(() => {
        initializeUser().then();
    }, []);
    useEffect(() => {
        if(user.isAuth){
            fetchSettings().then();
        }
    }, [user]);

    const fetchSettings = async () => {
        try {
            const {data} = await client.models.Settings.list({authMode:user.authMode});
            const settingsObject: SettingsObject = data.reduce((acc, setting) => {
                acc[setting.name] = setting;
                return acc;
            }, {} as SettingsObject);
            dispatch(setSettings(settingsObject));
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    if(!user.username && !user.groups.includes(guest) || game.settings.length === 0){
        return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                justifyContent: "center",
            }}
        >
            <CircularProgress size="5rem" />
        </Box>
        )
    }

    if (!groups.some((group) => user.groups.includes(group))) {
        return <NoAccessPage></NoAccessPage>;
    }

    return children;
};

export default ProtectedRoute;
