import {useDispatch, useSelector} from 'react-redux';
import {RootState, setSignOut, setUser} from '../redux/store.ts';
import {fetchAuthSession, getCurrentUser} from "aws-amplify/auth";
import {useEffect, ReactElement, useState} from "react";
import NoAccessPage from "./NoAccessPage.tsx";
import {InitSettings} from "../utils/InitialSettings.ts";
import {initialState} from "../redux/states/user.ts";
import {useError} from "../utils/setError.tsx";
import Loader from "../components/Loader.tsx";
import useRequest from "../api/useRequest.ts";
import {m_getUserProfileData} from "../api/models/UserProfileModels.ts";
import {Authenticator} from '@aws-amplify/ui-react';
import AutoSignOut from "./AutoSignOut.tsx";


interface ProtectedRouteProps {
    groups: string[];
    children: ReactElement;
}

const guest: string = 'GUEST';

const ProtectedRoute = ({groups, children}: ProtectedRouteProps) => {
    const user = useSelector((state: RootState) => state.user);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const setError = useError();

    const userProfileData = useRequest({
        model: m_getUserProfileData,
        errorCode: '#001:01'
    });


    const initializeUser = async () => {
        if (user.isAuth) return;

        try {
            setIsLoading(true);

            const userData: UserState = {...initialState};

            const session = await fetchAuthSession();
            //console.log(session)
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
                userProfileData.makeRequest({userId: userData.userId}).then()
            } else {
                userData.groups = [guest];
                userData.authMode = 'identityPool';
            }
            dispatch(setUser(userData));

            InitSettings(userData.authMode, userData.groups).then(
                (error) => {
                    if (error) {
                        setError('#001:02', 'Помилка завантаження налаштувань', error)
                        return;
                    }
                }
            );

        } catch (error) {
            setError('#001:03', 'Помилка при отриманні даних користувача', (error as Error).message)
        } finally {
            setIsLoading(false)
        }
    };
    useEffect(() => {
        if (userProfileData.result) {
            //console.log(userProfileData.result)
            const newUserData = {...user};
            if (userProfileData.result) {
                const profile: UserProfile = userProfileData.result;
                if (profile.banned) {
                    dispatch(setSignOut());
                    return;
                }
                newUserData.avatar = profile.avatar;
                newUserData.email = profile.email;
                newUserData.fullName = profile.fullName;
                newUserData.gender = profile.gender;
                newUserData.nickname = profile.nickname;
                newUserData.userProfileId = profile.id;
                dispatch(setUser(newUserData));
            }
        }
    }, [userProfileData.result]);

    useEffect(() => {
        initializeUser().then();
    }, []);

    if (user && user.signOut) {
        return (
            <Authenticator>
                {({signOut}) => {
                    return <AutoSignOut signOut={signOut!}/>;
                }}
            </Authenticator>
        );
    }
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
