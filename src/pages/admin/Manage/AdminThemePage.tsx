import React, {useEffect, useState} from 'react';
import { useTheme, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
interface PaletteColor {
    [key: string]: string;
}

interface Palette {
    primary: PaletteColor;
    secondary: PaletteColor;
    error: PaletteColor;
    warning: PaletteColor;
    info: PaletteColor;
    success: PaletteColor;
    grey: PaletteColor;
    mode: 'light' | 'dark';
}

interface Theme {
    palette: Palette;
}
function AdminThemePage() {
    const theme = useTheme() as Theme;
    const [colors, setColors] = useState<{ color: string; name: string }[]>([]);

    useEffect(() => {
        const colorGroups: (keyof Palette)[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success', 'grey'];
        const newColors = colorGroups.map(group => {
            const paletteGroup = theme.palette[group];
            if (typeof paletteGroup === 'object' && paletteGroup !== null) {
                return Object.keys(paletteGroup).map(subkey => ({
                    color: paletteGroup[subkey],
                    name: `${group}.${subkey}`
                }));
            }
            return [];
        }).flat();
        setColors(newColors);
    }, [theme.palette]);

    return (
        <div>
            <Grid container spacing={2} style={{ width: '100%', margin: '0px', padding:'25px' }}>
                <Typography variant="h6" style={{ width: '100%', marginBottom: '8px' }}>
                    Displaying {theme.palette.mode} mode colors
                </Typography>
                {colors.map((colorInfo, index) => (
                    <ColorBox key={index} color={colorInfo.color} name={colorInfo.name} />
                ))}
            </Grid>
        </div>
    );
}
function getBrightness(color: string) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
}
interface ColorBoxProps {
    color: string;
    name: string;
}
const ColorBox: React.FC<ColorBoxProps> = ({ color, name }) => {
    const brightness = getBrightness(color);
    const textColor = brightness > 125 ? '#000' : '#fff';
    const style = {
        backgroundColor: color,
        padding: '10px',
        color: textColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50px',
        borderRadius: '5px',
    };

    return (
        <Grid size={{xs:12, sm:6, md:4,lg:3}}>
            <Paper elevation={3} style={style}>
                <Typography variant="body2">{name}: {color}</Typography>
            </Paper>
        </Grid>
    );
};
export default AdminThemePage;
