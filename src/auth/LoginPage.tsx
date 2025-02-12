
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import { signIn } from 'aws-amplify/auth';
import Loader from "../components/Loader.tsx";
import BanedPage from './BanedPage.tsx';

function LoginPage() {
    const [isSignIn, setIsSignIn] = useState<boolean>(false);
    const [isBaned, setIsBanned] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tabParam = searchParams.get('tab');
    async function handleSignIn(username: string, password: string) {
        try {
            await signIn({
                username,
                password,
                options: {
                    clientMetadata: {} // Optional, an object of key-value pairs which can contain any key and will be passed to your Lambda trigger as-is.
                }
            });
            setIsSignIn(true);
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if (err.message === 'User is disabled.') {
                setIsBanned(true);
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            if(err.message === 'There is already a signed in user.'){
                setIsSignIn(true);
            }
            console.log(err);
        }
    }

    useEffect(() => {
        if(isSignIn){
            if(tabParam){
                navigate(`../profile?tab=${tabParam}`)
            }else{
                navigate('/')
            }
        }
    }, [isSignIn]);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const username = query.get('username');
        const token = query.get('token');

        handleSignIn(username!, token!).then();

    }, [location, navigate]);

    if(isBaned){
        return <BanedPage />
    }
    return (
        <Loader/>
    );
}

export default LoginPage;