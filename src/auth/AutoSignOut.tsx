import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {clearUser} from "../redux/store.ts";
import {useNavigate} from "react-router-dom";

function AutoSignOut({ signOut }: { signOut: () => void }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        signOut();
        navigate('/')
        dispatch(clearUser());
    }, []);

    return null;
}
export default AutoSignOut;