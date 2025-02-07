import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getDesignTokens } from './theme.tsx';
import {createContext, ReactNode, useEffect, useMemo, useState} from "react";

interface ColorModeProviderProps {
    children: ReactNode; // Тип для любых дочерних элементов
}

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function ColorModeProvider({ children }: ColorModeProviderProps) {
    const [mode, setMode] = useState<"light" | "dark">(() => {
        const savedMode = localStorage.getItem('themeMode');
        return savedMode ? savedMode as "light" | "dark" : "dark";
    });

    useEffect(() => {
        localStorage.setItem('themeMode', mode);
    }, [mode]);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode: string) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () => createTheme(getDesignTokens(mode)),
        [mode],
    );

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default ColorModeProvider;
