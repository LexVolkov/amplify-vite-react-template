import CharControlPage from "./CharControlPage.tsx";
import Grid from "@mui/material/Grid2";
import {Paper} from "@mui/material";
import {ServerSelector} from "../../components/ServerSelector.tsx";
import {SearchBox} from "../../components/SearchBox.tsx";
import {useState} from "react";
import {TabSelector} from "../../components/TabSelector.tsx";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
const tabs = [
    {index: 0,label: 'Герої', icon: <PersonAddAlt1Icon/>},
];
export default function ControlPage() {
    const [selectedServerId, setSelectedServerId] = useState<string>('');
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState<string | ''>('');
    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12, md: 12}}>
                <Paper elevation={3} sx={{padding: 2}}>
                    <Grid container spacing={2}>
                        <Grid size={{xs: 12, md: 6}}>
                            <ServerSelector
                                activeOnly={true}
                                value={selectedServerId}
                                onChange={(serverId) => setSelectedServerId(serverId)}
                            />
                        </Grid>
                        <Grid size={{xs: 12, md: 6}}>
                            <TabSelector tabs={tabs}
                                         index={activeTabIndex}
                                         onChange={(index) => setActiveTabIndex(index)}/>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid size={12}>
                <SearchBox onChange={setSearchQuery}/>
            </Grid>
            <Grid size={12}>
                {activeTabIndex === 0 && <CharControlPage
                    selectedServerId={selectedServerId}
                    searchQuery={searchQuery}
                />}
            </Grid>
        </Grid>
    );
}