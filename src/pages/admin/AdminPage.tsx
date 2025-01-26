import {useState} from "react";
import AdminCharacterPage from "./Manage/AdminCharacterPage.tsx";
import AdminItemPage from "./Manage/AdminItemPage.tsx";
import AdminLogPage from "./Manage/AdminLogPage.tsx";
import AdminSettingPage from "./Manage/AdminSettingPage.tsx";
import AdminServerPage from "./Manage/AdminServerPage.tsx";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import DnsIcon from '@mui/icons-material/Dns';
import GroupIcon from '@mui/icons-material/Group';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoryIcon from '@mui/icons-material/History';
import Button from "@mui/material/Button/Button";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImageIcon from '@mui/icons-material/Image';
import AdminAssetPage from "./Manage/AdminAssetPage.tsx";
import AdminThemePage from "./Manage/AdminThemePage.tsx";
import Brightness7Icon from '@mui/icons-material/Brightness7';

// Массив страниц админ-панели
const adminPages = [
    {name: "Зміни", component: <AdminServerPage/>, icon: <DnsIcon fontSize="large"/>},
    {name: "Персонажі", component: <AdminCharacterPage/>, icon: <GroupIcon fontSize="large"/>},
    {name: "Предмети", component: <AdminItemPage/>, icon: <CategoryIcon fontSize="large"/>},
    {name: "Налаштування", component: <AdminSettingPage/>, icon: <SettingsIcon fontSize="large"/>},
    {name: "Графіка", component: <AdminAssetPage/>, icon: <ImageIcon fontSize="large"/>},
    {name: "Логи", component: <AdminLogPage/>, icon: <HistoryIcon fontSize="large"/>},
    {name: "Палітра", component: <AdminThemePage/>, icon: <Brightness7Icon fontSize="large"/>},
];

function AdminPage() {
    const [activePage, setActivePage] = useState<string | null>(null); // null = главная страница

    return (
        <Box sx={{padding: "20px"}}>
            {activePage === null ? (
                // Меню на главной странице
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "center",
                    }}
                >
                    {adminPages.map((page) => (
                        <Paper
                            key={page.name}
                            elevation={12}
                            sx={{
                                padding: "00px",
                                textAlign: "center",
                                cursor: "pointer",
                                width: "200px",
                                height: "200px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onClick={() => setActivePage(page.name)}
                        >
                            <Button color="secondary" sx={{width: "100%", height: "100%"}}>
                                <Box>
                                    {page.icon}
                                    <Typography variant="h6">{page.name}</Typography>
                                </Box>
                            </Button>
                        </Paper>
                    ))}
                </Box>
            ) : (
                // Контент выбранной страницы
                <Box>
                    <Box sx={{marginBottom: 3}}>
                        <Typography variant="h5" gutterBottom>
                            {activePage}
                        </Typography>
                    </Box>

                    <Box sx={{marginBottom: 3}}>
                        <Button variant="outlined" startIcon={<ArrowBackIosIcon/>}
                                onClick={() => setActivePage(null)}>
                            <Typography>Меню</Typography>
                        </Button>
                    </Box>

                    {
                        adminPages.find((page) => page.name === activePage)?.component
                    }
                    <Box sx={{marginTop: 3}}>
                        <Button variant="outlined" startIcon={<ArrowBackIosIcon/>}
                                onClick={() => setActivePage(null)}>
                            <Typography>Меню</Typography>
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default AdminPage;
