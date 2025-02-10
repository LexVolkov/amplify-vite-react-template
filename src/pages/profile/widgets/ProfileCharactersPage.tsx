
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "../../../redux/store.ts";
import useRequest from "../../../api/useRequest.ts";
import {m_listOwnCharacters} from "../../../api/models/CharacterModels.ts";
import CharacterList from "../../../components/CharacterList.tsx";

function ProfileCharactersPage() {
    const user = useSelector((state: RootState) => state.user);
    const [chars, setChars] = useState<Character[]>([]);

    const charsData = useRequest(
        {model: m_listOwnCharacters, errorCode: '#008:01'});

    useEffect(() => {
        if(user && user.userId){
            charsData.makeRequest({userId: user.userId}).then()
        }
    }, [user]);

    useEffect(() => {
        if(charsData.result){
            setChars(charsData.result);
        }
    }, [charsData.result]);

    return (
        <div>
            <CharacterList
                characters={chars}
                isLoading={charsData.isLoading}
                isServerName={true}
            />
        </div>
    );
}

export default ProfileCharactersPage;