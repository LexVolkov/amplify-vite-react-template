import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button/Button";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
const UserBar = () => {

    return (
        <div>
            <Stack direction="row" spacing={1}>
                <Button href="/profile" color="primary">
                    <AccountBoxIcon/>
                </Button>
                <Button href="/control" color="primary">
                    <AddModeratorIcon/>
                </Button>
                <Button href="/admin" color="primary">
                    <AdminPanelSettingsIcon/>
                </Button>
            </Stack>
        </div>
    );
};
export default UserBar;
