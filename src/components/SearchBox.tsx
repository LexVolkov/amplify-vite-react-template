import {
    TextField,
    Box, IconButton, useTheme
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { AccountCircle} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";


interface SearchBoxProps {
    onChange: (searchQuery: string) => void;
}

export const SearchBox: FC<SearchBoxProps> = ({onChange }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const theme = useTheme();
    useEffect(() => {
        onChange(searchQuery);
    }, [onChange, searchQuery]);
    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-end',
            background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: theme.shadows[4],
            borderRadius: '16px',
            padding: '10px',
            height: '60px',
            width: '270px'
        }}>
            <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField id="input-with-sx" label="Пошук" variant="standard"
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}/>
            {searchQuery && <IconButton onClick={() => {setSearchQuery('')}} color="inherit"  size="small">
                <CloseIcon fontSize="inherit"/>
            </IconButton>}
        </Box>
    );
};