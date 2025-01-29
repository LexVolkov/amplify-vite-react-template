import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button/Button";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
import {useNavigate} from "react-router-dom";
const UserBar = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Stack direction="row" spacing={1}>
                <Button onClick={() => navigate('/profile')} color="primary">
                    <AccountBoxIcon/>
                </Button>
                <Button onClick={() => navigate('/control')} color="primary">
                    <AddModeratorIcon/>
                </Button>
                <Button onClick={() => navigate('/admin')} color="primary">
                    <AdminPanelSettingsIcon/>
                </Button>
            </Stack>
        </div>
    );
};
export default UserBar;
