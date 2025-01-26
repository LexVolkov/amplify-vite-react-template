import {useSelector} from "react-redux";
import {RootState} from "../../redux/store.ts";
import CharacterPage from "./characters/CharacterPage.tsx";


function PublicPage() {

    const user = useSelector((state: RootState) => state.user);


    if(user.isAuth){
        return <CharacterPage />;
    }
}

export default PublicPage;
