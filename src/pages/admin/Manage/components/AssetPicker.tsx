import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    IconButton,
} from '@mui/material';
import {useState} from "react";
import AssetBrowser from '../widgets/AssetBrowser.tsx';
import AssetIcon from "../../../../components/AssetIcon.tsx"; // Предыдущий компонент переименован в AssetBrowser


interface AssetPickerProps {
    value: string;
    onChange: (value: string) => void;
}

const AssetPicker = ({value, onChange}: AssetPickerProps) => {
    const [open, setOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(value);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box>
            <IconButton onClick={handleOpen}>
                <AssetIcon assetId={value} size={30} />
            </IconButton>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Выберите ассет</DialogTitle>

                <DialogContent>
                    <AssetBrowser
                        value={selectedAsset}
                        onChange={setSelectedAsset}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            onChange(selectedAsset);
                            handleClose();
                        }}
                        variant="contained"
                    >
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AssetPicker;