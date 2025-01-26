import { ReactNode, useState } from 'react';
import {
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Typography, Divider, Avatar
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import {deepOrange} from "@mui/material/colors";

interface BaseCardProps<T, C> {
    title?: string;
    place?: number;
    isLoading?: boolean;
    renderEditForm: (
        data: T | C,
        onChange: (newData: T | C) => void
    ) => ReactNode;
}

interface ViewCardProps<T, C> extends BaseCardProps<T, C> {
    mode?: 'view';
    data: T;
    defaultData: T;
    onUpdate?: (data: T) => Promise<void>;
    onDelete?: (data: T) => Promise<void>;
    renderPreview?: (data: T) => ReactNode;
    onCreate?: Character;

}

interface CreateCardProps<T, C> extends BaseCardProps<T, C> {
    mode: 'create';
    data?: never;
    defaultData: C;
    onCreate: (data: C) => Promise<void>;
    onUpdate?: never;
    onDelete?: never;
    renderPreview?: never;
}

type CardProps<T, C> = ViewCardProps<T, C> | CreateCardProps<T, C>;

function UniversalCard<T, C>(props: CardProps<T, C>) {
    const {
        title,
        place,
        isLoading = false,
        renderEditForm,
    } = props;

    const theme = useTheme();

    // Используем дискриминированное объединение для определения типа состояния
    const [editedData, setEditedData] = useState<T | C>(
        props.mode === 'create'
            ? props.defaultData as C
            : props.data as T
    );

    const [isOpen, setIsOpen] = useState(props.mode === 'create');
    const [isEditing, setIsEditing] = useState(props.mode === 'create');

    const handleOpen = () => {
        setIsOpen(true);
        if (props.mode === 'create') {
            setEditedData(props.defaultData);
        } else {
            setEditedData(props.data);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsEditing(false);
        if (props.mode === 'create') {
            setEditedData(props.defaultData);
        } else {
            setEditedData(props.data);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (props.mode === 'create') {
            await props.onCreate(editedData as C);
            handleClose();
        } else if (props.onUpdate) {
            await props.onUpdate(editedData as T);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        if (props.mode !== 'create' && props.onDelete) {
            await props.onDelete(props.data);
            handleClose();
        }
    };

    const handleChange = (newData: T | C) => {
        setEditedData(newData);
    };

    if (props.mode === 'create') {
        return (
            <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Create New {title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the details.
                    </DialogContentText>
                    {renderEditForm(editedData, handleChange)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <LoadingButton
                        loading={isLoading}
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        variant="outlined"
                        onClick={handleSave}
                    >
                        Create
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <>
            <Card
                sx={{
                    margin: '10px',
                    width: '200px',
                    cursor: 'pointer',
                    border: `2px solid ${theme.palette.primary.main}`,
                    transition: 'border-color 0.3s',
                    '&:hover': {
                        borderColor: theme.palette.secondary.main,
                    },
                }}
                onClick={handleOpen}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px', // Отступ между аватаром и текстом
                        }}
                    >
                        {place ? (
                            <Avatar
                                sx={{
                                    width: 32,  // Уменьшенный размер аватара
                                    height: 32,
                                    bgcolor: deepOrange[500]
                                }}
                            >
                                {place}
                            </Avatar>
                        ) : null}

                        <Typography variant="h5" component="div">
                            {title}
                        </Typography>
                    </Box>
                    <Divider
                        variant="middle"
                        sx={{
                            margin: '10px',
                        }}
                    />
                    {props.renderPreview && props.data && props.renderPreview(props.data)}
                </CardContent>

            </Card>

            <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing ? `Edit ${title}` : title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {isEditing ? 'Edit the details.' : 'View the details.'}
                    </DialogContentText>
                    {isEditing ? (
                        renderEditForm(editedData, handleChange)
                    ) : (
                        props.renderPreview && props.data && props.renderPreview(props.data)
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleClose}>Cancel</Button>
                    {props.onDelete && (
                        <LoadingButton
                            loading={isLoading}
                            loadingPosition="start"
                            startIcon={<DeleteForeverIcon />}
                            variant="contained"
                            onClick={handleDelete}
                        >
                            Delete
                        </LoadingButton>
                    )}
                    {props.onUpdate && (
                        isEditing ? (
                            <LoadingButton
                                loading={isLoading}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained"
                                onClick={handleSave}
                            >
                                Save
                            </LoadingButton>
                        ) : (
                            <Button variant="contained" onClick={handleEdit}>Edit</Button>
                        )
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UniversalCard;