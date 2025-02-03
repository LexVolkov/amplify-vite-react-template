import {useDispatch, useSelector} from 'react-redux';
import {RootState, setUser} from '../redux/store.ts';
import {fetchAuthSession, getCurrentUser} from "aws-amplify/auth";
import {useEffect, ReactElement, useState} from "react";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../amplify/data/resource.ts";
import NoAccessPage from "./NoAccessPage.tsx";
import {InitSettings} from "../utils/InitialSettings.ts";
import {initialState} from "../redux/states/user.ts";
import {useError} from "../utils/setError.tsx";
import Loader from "../components/Loader.tsx";

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
    const setError = useError();

    const initializeUser = async () => {
        if (user.isAuth) return;
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
            const {data, errors} = await client.models.UserProfile.list({});
            if (errors) {
                setError('#001:01', 'Помилка при отриманні даних користувача', errors.length > 0 ? errors[0]?.message : '')
                return;
            }
            if (data && data.length > 0) {
                const profile = data[0];
                userData.avatar = profile.avatar;
                userData.email = profile.email;
                userData.fullName = profile.fullName;
                userData.gender = profile.gender;
                userData.nickname = profile.nickname;
            }
            InitSettings(userData.authMode, userData.groups).then(
                (error) => {
                    if (error) {
                        setError('#001:02', 'Помилка завантаження налаштувань', error)
                        return;
                    }
                }
            );
            dispatch(setUser(userData));
        } catch (error) {
            setError('#001:03', 'Помилка при отриманні даних користувача', (error as Error).message)
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        initializeUser().then();
    }, []);

    if ((!user.username && !user.groups.includes(guest)) || isLoading) {
        return (
            <Loader/>
        )
    }

    if (!groups.some((group) => user.groups.includes(group))) {
        return <NoAccessPage></NoAccessPage>;
    }

    return children;
};

export default ProtectedRoute;
