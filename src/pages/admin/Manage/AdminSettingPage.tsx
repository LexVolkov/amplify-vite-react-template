import {
    Button,
    TextField,
    IconButton,
    MenuItem,
    Select, Switch,
    Paper, Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import type {Schema} from "../../../../amplify/data/resource.ts";
import {generateClient} from "aws-amplify/data";
import {useState, useEffect} from "react";
import {Skeleton} from "@mui/material";
import AssetPicker from './components/AssetPicker.tsx';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AssetIcon from "../../../components/AssetIcon.tsx";

const client = generateClient<Schema>();

const defaultSettingData: Setting = {
    id: `temp-${Date.now()}`,
    name: '',
    value: '',
    description: '',
    type: 'string',
    createdAt: '',
    updatedAt: ''
};

function AdminSettingPage() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [editedSettings, setEditedSettings] = useState<Record<string, Setting>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingSave, setIsLoadingSave] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setIsLoading(true);
                const {data, errors} = await client.models.Settings.list({});
                if (errors) {
                    console.error(errors);
                }
                setSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
                setError('Failed to load settings. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings().then();
    }, []);

    const createSetting = () => {
        const newSetting = {...defaultSettingData, id: `temp-${Date.now()}`};
        setSettings([ newSetting,...settings]);
        setEditedSettings({
            ...editedSettings,
            [newSetting.id]: newSetting
        });
        setEditingId(newSetting.id);
    };

    const handleFieldChange = (id: string, field: keyof Setting, value: string) => {
        const updatedSettings = settings.map(setting =>
            setting.id === id ? {...setting, [field]: value} : setting
        );
        setSettings(updatedSettings);
        setEditedSettings({
            ...editedSettings,
            [id]: {...settings.find(setting => setting.id === id), [field]: value}
        });
    };

    const saveChanges = async (id: string) => {
        setError(null);
        const setting = settings.find(setting => setting.id === id);
        if (!setting) {
            setError('Setting not found');
            return;
        }
        if (setting.name === '') {
            setError('NAME cannot be empty');
            return;
        }
        try {
            setIsLoadingSave(id);
            if (setting.id.startsWith('temp-')) {
                const {data, errors} = await client.models.Settings.create({
                    name: setting.name,
                    value: setting.value,
                    description: setting.description || null,
                    type: setting.type
                });
                if (errors) {
                    console.error(errors);
                    setError(`Failed to create setting: ${errors[0].message}`);
                }
                setSettings(prev =>
                    prev.map(s => (s.id === setting.id ? {...data} : s))
                );
            } else {
                const {data, errors} = await client.models.Settings.update({
                    id: setting.id,
                    name: setting.name,
                    value: setting.value,
                    description: setting.description || null,
                    type: setting.type
                });
                if (errors) {
                    console.error(errors);
                    setError(`Failed to update setting: ${errors[0].message}`);
                }
                setSettings(prev =>
                    prev.map(s => (s.id === setting.id ? {...data} : s))
                );
            }
            setEditedSettings({});
            setEditingId(null);
        } catch (error) {
            setError(`Error saving changes: ${(error as Error).message}`);
        } finally {
            setIsLoadingSave('');
        }
    };

    const deleteSetting = async (id: string) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this setting line?');
        if (confirmDelete) {
            try {
                setError(null);
                setIsLoading(true);
                await client.models.Settings.delete({id: id});
                setSettings(settings.filter(setting => setting.id !== id));
            } catch (error) {
                setError(`Delete failed: ${(error as Error).message}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderValueField = (setting: Setting, edited: boolean) => {
        switch (setting.type) {
            case 'number':
                if (edited) {
                    return (
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            value={setting.value || ''}
                            onChange={(e) => handleFieldChange(setting.id, 'value', e.target.value)}
                            placeholder="Value"
                            sx={{marginRight: 2}}
                        />
                    );
                } else {
                    return setting.value || '';
                }

            case 'color':
                if (edited) {
                    return (
                        <TextField
                            fullWidth
                            size="small"
                            type="color"
                            value={setting.value || '#000000'}
                            onChange={(e) => handleFieldChange(setting.id, 'value', e.target.value)}
                            placeholder="Value"
                            sx={{marginRight: 2}}
                        />
                    );
                } else {
                    return (
                        <TextField
                            fullWidth
                            size="small"
                            type="color"
                            value={setting.value || '#000000'}
                            onChange={(e) => handleFieldChange(setting.id, 'value', e.target.value)}
                            placeholder="Value"
                            sx={{marginRight: 2}}
                            disabled={true}
                        />
                    );
                }

            case 'boolean':

                if (edited) {
                    return (<Switch
                        checked={setting.value === 'true'}
                        onChange={(e) => handleFieldChange(setting.id, 'value', e.target.checked ? 'true' : 'false')}
                    />);
                } else {
                    return setting.value === 'true' ? <ThumbUpIcon/> : <ThumbDownIcon/>;
                }
            case 'asset':
                if (edited) {
                    return (
                        <AssetPicker
                            value={setting.value || ''}
                            onChange={(value) => handleFieldChange(setting.id, 'value', value)}
                        />
                    );
                } else {
                    return <AssetIcon assetId={setting.value} size={30}/>
                }


            default:
                if (edited) {
                    return (
                        <TextField
                            fullWidth
                            size="small"
                            value={setting.value || ''}
                            onChange={(e) => handleFieldChange(setting.id, 'value', e.target.value)}
                            placeholder="Value"
                            sx={{marginRight: 2}}
                        />
                    );
                } else {
                    return setting.value;
                }

        }
    };

    const handleEdit = (id: string) => {
        setEditingId(id);
    };

    const handleSave = (id: string) => {
        saveChanges(id).then();
        setEditingId(null);
    };

    return (
        <div>
            <Button sx={{margin: '10px 0'}} variant="contained" onClick={createSetting}>
                + Add New
            </Button>
            {error && (
                <Alert severity="error" sx={{mb: 2}} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {isLoading ? (
                <Skeleton variant="rectangular" width="100%" height={118}/>
            ) : (
                <Paper elevation={0}>
                    {settings.map(setting => (
                        <div key={setting.id}>
                            <Paper elevation={4} sx={{width: '100%', padding: 1, margin: '10px'}}>
                                <Grid container spacing={2} alignItems="center">
                                    {editingId === setting.id ? (
                                        <>
                                            <Grid>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="save"
                                                    onClick={() => handleSave(setting.id)}
                                                >
                                                    <DoneIcon/>
                                                </IconButton>
                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => deleteSetting(setting.id)}
                                                >
                                                    <DeleteForeverIcon/>
                                                </IconButton>
                                            </Grid>
                                            <Grid size={{xs: 12, md: 3}}>
                                                <TextField
                                                    size="small"
                                                    value={setting.name || ''}
                                                    onChange={e =>
                                                        handleFieldChange(setting.id, 'name', e.target.value)
                                                    }
                                                    placeholder="Name"
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid size={{xs: 12, md: 2}}>
                                                <Select
                                                    size="small"
                                                    value={setting.type}
                                                    onChange={(e) => handleFieldChange(setting.id, 'type', e.target.value as Setting["type"])}
                                                    fullWidth
                                                >
                                                    <MenuItem value="string">String</MenuItem>
                                                    <MenuItem value="number">Number</MenuItem>
                                                    <MenuItem value="asset">Asset</MenuItem>
                                                    <MenuItem value="color">Color</MenuItem>
                                                    <MenuItem value="boolean">Boolean</MenuItem>
                                                </Select>
                                            </Grid>
                                            <Grid size={{xs: 12, md: 3}}>
                                                {renderValueField(setting, true)}
                                            </Grid>
                                            <Grid size={{xs: 10, md: 3}}>
                                                <TextField
                                                    size="small"
                                                    value={setting.description || ''}
                                                    onChange={e =>
                                                        handleFieldChange(setting.id, 'description', e.target.value)
                                                    }
                                                    placeholder="Description"
                                                    fullWidth
                                                />
                                            </Grid>

                                        </>
                                    ) : (
                                        <>
                                            {isLoadingSave === setting.id ?
                                                <Skeleton animation="wave"  variant="rounded" width="100%" height={60}/>
                                                :
                                                <>
                                                    <Grid style={{display: 'flex', justifyContent: 'flex-end'}}>
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="edit"
                                                            onClick={() => handleEdit(setting.id)}
                                                        >
                                                            <EditIcon/>
                                                        </IconButton>
                                                    </Grid>

                                                    <Grid size={{xs: 10, md: 3}}>
                                                        <Paper elevation={6}
                                                               sx={{width: '100%', padding: 2, marginTop: '10px'}}>
                                                            {setting.name}
                                                        </Paper>
                                                    </Grid>

                                                    <Grid size={{xs: 12, md: 2}}>
                                                        <Paper elevation={6}
                                                               sx={{width: '100%', padding: 2, marginTop: '10px'}}>
                                                            {renderValueField(setting, false)}
                                                        </Paper>
                                                    </Grid>
                                                    <Grid size={{xs: 12, md: 6}}>
                                                        <Paper elevation={6}
                                                               sx={{width: '100%', padding: 2, marginTop: '10px'}}>
                                                            {setting.description}
                                                        </Paper>
                                                    </Grid>
                                                </>
                                        }
                                        </>
                                    )}
                                </Grid>
                            </Paper>
                        </div>
                    ))}
                </Paper>
            )}
        </div>
    );
}

export default AdminSettingPage;