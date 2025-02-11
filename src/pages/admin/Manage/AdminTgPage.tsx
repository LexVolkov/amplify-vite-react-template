import React, {useState} from "react";
import Grid from "@mui/material/Grid2";
import {TabSelector} from "../../../components/TabSelector.tsx";
import TelegramWebhook from "./widgets/TelegramWebhook.tsx";
import TelegramSendMessage from "./widgets/TelegramSendMessage.tsx";
import Subscriptions from "./widgets/Subscriptions.tsx";
const tabs = [
    {index: 0,label: 'Підписки', icon: null},
    {index: 1,label: 'Webhook', icon: null},
    {index: 2,label: 'SendMessage', icon: null},
];
const AdminTgPage: React.FC = () => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 12}}>
                <TabSelector tabs={tabs}
                             index={activeTabIndex}
                             onChange={(index) => setActiveTabIndex(index)}/>
            </Grid>
            <Grid size={12}>
                {activeTabIndex === 0 && <Subscriptions/>}
                {activeTabIndex === 1 && <TelegramWebhook/>}
                {activeTabIndex === 2 && <TelegramSendMessage/>}
            </Grid>
        </Grid>
    );
};

export default AdminTgPage;
