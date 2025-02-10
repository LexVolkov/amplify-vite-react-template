import React, {FC} from "react";
import {Theme, useTheme} from "@mui/material/styles";
import {Box, Typography} from "@mui/material";
import BrowserNotSupportedIcon from "@mui/icons-material/BrowserNotSupported";

type DisplayCellProps = {
    label: string;
    value: React.ReactNode;
};

export const DisplayCell: FC<DisplayCellProps> = ({ label, value }) => {
    const theme = useTheme() as Theme;
    const isEmpty =
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '');

    return (
        <Box
            sx={{
                p: 1,
                border: '1px solid',
                borderColor: theme.palette.divider,
                borderRadius: 1,
                backgroundColor: theme.palette.background.paper,
            }}
        >
            <Typography variant="body1" fontWeight="bold" >
                {label}:
            </Typography>
            {isEmpty ? (
                <BrowserNotSupportedIcon color="disabled" />
            ) : typeof value === 'string' || typeof value === 'number' ? (
                <Typography variant="body2" color={'textDisabled'}>{value}</Typography>
            ) : (
                value
            )}
        </Box>
    );
};