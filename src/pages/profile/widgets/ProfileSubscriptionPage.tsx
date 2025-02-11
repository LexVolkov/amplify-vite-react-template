import { useEffect, useState } from "react";
import useRequest from "../../../api/useRequest.ts";
import {  Typography, Box } from "@mui/material";
import { m_listSubscriptionCharacters } from "../../../api/models/CharacterModels.ts";
import {ServerSelector} from "../../../components/ServerSelector.tsx";
import ProfileSubscriptionPageUI from "./ProfileSubscriptionPageUI.tsx";
import {m_setSubscription, m_setUnSubscription} from "../../../api/models/SubscriptionModels.ts";

function ProfileSubscriptionPage() {

    const [selectedServerId, setSelectedServerId] = useState<string>('');
    const [chars, setChars] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState<string>('');

    const subscriptionData = useRequest({
        model: m_listSubscriptionCharacters,
        errorCode: '#009:01'
    });
    const createSubUpdateResult = useRequest({
        model: m_setSubscription,
        errorCode: '#009:02'
    });
    const deleteSubUpdateResult = useRequest({
        model: m_setUnSubscription,
        errorCode: '#009:03'
    });

    useEffect(() => {
        if (selectedServerId && selectedServerId !== '') {
            subscriptionData.makeRequest({ serverId: selectedServerId }).then();
        }
    }, [selectedServerId]);

    useEffect(() => {
        if (subscriptionData.result) {
            setChars(subscriptionData.result);
        }
    }, [subscriptionData.result]);

    const handleSubscribe =  (characterId: string) => {
        setIsLoading(characterId);
        createSubUpdateResult.makeRequest({characterId}).then();
    };

    const handleUnsubscribe =  (characterId: string) => {
        if (window.confirm("Ви впевнені, що хочете відписатися?")) {
            setIsLoading(characterId);
            deleteSubUpdateResult.makeRequest({characterId}).then();
        }
    };
    useEffect(() => {
        if (createSubUpdateResult.result) {
            setChars(prevChars =>
                prevChars.map(char =>
                    char.id === createSubUpdateResult.result.characterId
                        ? {
                            ...char,
                            charSubscription: [...char.charSubscription, createSubUpdateResult.result]
                        }
                        : char
                )
            );
            setIsLoading('');
        }
    }, [createSubUpdateResult.result]);

    useEffect(() => {
        if (deleteSubUpdateResult.result) {
            setChars(prevChars =>
                prevChars.map(char =>
                    char.id === deleteSubUpdateResult.result.characterId
                        ? {
                            ...char,
                            charSubscription: char.charSubscription.filter(
                                (sub:CharSubscription) => sub.id !== deleteSubUpdateResult.result.id
                            )
                        }
                        : char
                )
            );
            setIsLoading('');
        }
    }, [deleteSubUpdateResult.result]);
    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: "auto" }}>
            <Typography variant="h5" align="center" gutterBottom>
                Підписки на персонажів
            </Typography>
            <ServerSelector
                activeOnly={true}
                value={selectedServerId}
                onChange={(serverId) => setSelectedServerId(serverId)}
            />
            <ProfileSubscriptionPageUI
                isLoading={isLoading}
                chars={chars}
                onSubscribe={handleSubscribe}
                onUnsubscribe={handleUnsubscribe}
            />
        </Box>
    );
}

export default ProfileSubscriptionPage;
