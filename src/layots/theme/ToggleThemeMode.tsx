import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import {Tooltip, useTheme} from "@mui/material";
import {useContext} from "react"; // Импорт ColorModeContext
import { ColorModeContext } from './ColorModeProvider';

function ToggleThemeMode() {
    const colorMode = useContext(ColorModeContext);
    const theme = useTheme();

    return (
        <Tooltip
            disableInteractive
            title={theme.palette.mode === 'dark' ? "Переключити на світлу тему" : "Переключити на темну тему"}
            placement="bottom"
            arrow
        >
            <IconButton
                sx={{
                    margin: '10px 10px 10px'
                }}
                onClick={colorMode.toggleColorMode}
                color="inherit"
            >
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Tooltip>
    );
}

export default ToggleThemeMode;
