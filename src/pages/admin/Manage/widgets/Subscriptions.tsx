import React, {useEffect, useState} from 'react';
import useRequest from "../../../../api/useRequest.ts";
import {
    m_listAdminSubscriptionCharacters,
} from "../../../../api/models/CharacterModels.ts";
import {Box, Typography} from "@mui/material";
import {ServerSelector} from "../../../../components/ServerSelector.tsx";
import SubscriptionsUI from "./SubscriptionsUI.tsx";


const Subscriptions: React.FC = () => {
    const [selectedServerId, setSelectedServerId] = useState<string>('');
    const [chars, setChars] = useState<Character[]>([]);

    const subscriptionData = useRequest({
        model: m_listAdminSubscriptionCharacters,
        errorCode: '#010:01'
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



    return (
        <Box sx={{ p: 2, maxWidth: 600, margin: "auto" }}>
            <Typography variant="h5" align="center" gutterBottom>
                Підписки на персонажів
            </Typography>
            <ServerSelector
                activeOnly={false}
                value={selectedServerId}
                onChange={(serverId) => setSelectedServerId(serverId)}
            />
            <SubscriptionsUI
                chars={chars}
            />
        </Box>
    );
};

export default Subscriptions;