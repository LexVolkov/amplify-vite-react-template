import React, {useState} from "react";
import Grid from "@mui/material/Grid2";
import {TabSelector} from "../../../components/TabSelector.tsx";
import TelegramWebhook from "./widgets/TelegramWebhook.tsx";
import TelegramSendMessage from "./widgets/TelegramSendMessage.tsx";
const tabs = [
    {index: 0,label: 'Webhook', icon: null},
    {index: 1,label: 'SendMessage', icon: null},
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
                {activeTabIndex === 0 && <TelegramWebhook/>}
                {activeTabIndex === 1 && <TelegramSendMessage/>}
            </Grid>
        </Grid>
    );
};

export default AdminTgPage;
