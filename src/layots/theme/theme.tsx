import {deepOrange, grey, lime, lightBlue, indigo, red} from '@mui/material/colors';
import {ThemeOptions} from "@mui/material";

export const getDesignTokens = (mode: "light" | "dark"): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                primary: lightBlue,
                secondary: indigo,
                divider: grey[900],
                error: {
                    main: deepOrange[500], // Ваш цвет ошибки для светлого режима
                },
                text: {
                    primary: grey[900],
                    secondary: grey[800],
                },

            }
            : {
                primary: indigo,
                secondary: lime,
                error: {
                    main: red[300], // Ваш цвет ошибки для темного режима
                },
                divider: grey[700],
                text: {
                    primary: grey[300],
                    secondary: grey[500],
                },

            }),
    },
});
