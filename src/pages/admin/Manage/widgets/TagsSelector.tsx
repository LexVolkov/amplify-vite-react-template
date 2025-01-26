import {FC, useEffect, useMemo, useState} from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Button,
    IconButton,
    ButtonGroup
} from '@mui/material';
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../../../amplify/data/resource.ts";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SettingsIcon from '@mui/icons-material/Settings';
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

const client = generateClient<Schema>();

interface TagsSelectorProps {
    tagIds?: string[];
    onTagsSelect?: (tagsIds: string[]) => void;
    onTags?: (tags: Tag[]) => void;
    onError: (error: string) => void;
}

export const TagsSelector: FC<TagsSelectorProps> = ({
                                                        tagIds = [],
                                                        onTagsSelect,
                                                        onError,
                                                        onTags
                                                    }) => {
    const [tagsSelected, setTagsSelected] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditedTags, setIsEditedTags] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [editedTags, setEditedTags] = useState<Tag[]>([]);

    useEffect(() => {
        onTags?.(tags);
    }, [tags]);

    useEffect(() => {
        onTagsSelect?.(tagsSelected.map(t => t.id));
    }, [tagsSelected]);


    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            try {
                const {data: tagData} = await client.models.Tag.list({});
                setTags(tagData);
            } catch (err) {
                onError('Error fetching tags: ' + (err instanceof Error ? err.message : String(err)));
            } finally {
                setIsLoading(false);
            }
        };
        fetchTags().then();
    }, []);

    const handleTagEdit = () => {
        setIsEditedTags(true);
        setEditedTags(tags);
    };

    const handleTagEditChange = (id: string, field: keyof Tag, value: string) => {
        const updatedTags = editedTags.map((t) =>
            t.id === id ? {...t, [field]: value} : t
        );
        setEditedTags(updatedTags);
    };

    const saveEditedTags = async () => {
        if (editedTags.find((t: Tag) => t.name === '')) {
            onError('Tag NAME cannot be empty');
            return;
        }
        try {
            setIsLoading(true);
            for (const tag of tags) {
                if (!editedTags.find(t => t.id === tag.id)) {
                    await client.models.Tag.delete({id:tag.id});
                    setTags((prev) => prev.filter((t) => t.id !== tag.id));
                }
            }
            for (const tag of editedTags) {
                if (tag.id.startsWith('temp-')) {
                    // Create new tag
                    const {data, errors} = await client.models.Tag.create({
                        name: tag.name,
                        description: tag.description || '',
                    });
                    if (errors) console.error(errors);
                    setTags((prev) => [...prev.filter((t) => t.id !== tag.id), data]);
                } else {

                    if(tag.name === tags.find(t => t.id === tag.id).name
                        && tag.description === tags.find(t => t.id === tag.id).description)
                        continue;
                    // Update existing tag
                    const {data, errors} = await client.models.Tag.update({
                        id: tag.id,
                        name: tag.name,
                        description: tag.description || '',
                    });
                    if (errors) console.error(errors);
                    setTags((prev) => prev.map((t) => (t.id === tag.id ? data : t)));
                }
            }
            setEditedTags([]);
            setIsEditedTags(false);
        } catch (err) {
            onError('Error saving edited tags: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsLoading(false);
        }
    };

    const addNewTag = () => {
        const newTag = {
            id: `temp-${Math.random().toString(36)}`,
            name: '',
            description: '',
        };
        setEditedTags((prev) => [...prev, newTag]);

    };

    const deleteTag = async (id: string) => {
        setEditedTags((prev) => prev.filter((tag) => tag.id !== id));
    };

    const handleTagSelect = (tag: Tag) => {
        if (tagsSelected.includes(tag)) {
            setTagsSelected((prev) => prev.filter((t) => t.id !== tag.id));
        } else {
            setTagsSelected((prev) => [...prev, tag]);
        }
    };

    const filteredTags = useMemo(() => {
        let filtered;
        if (isEditedTags) {
            filtered = editedTags;
        } else {
            filtered = tags.filter(tag => tagIds.includes(tag.id));
        }

        // Sort the filtered tags by name
        filtered.sort((a, b) => a.name.localeCompare(b.name));

        return filtered;
    }, [isEditedTags, editedTags, tags, tagIds]);

    return (
        <Paper sx={{p: 2}}>
            <Typography variant="h6" gutterBottom>
                Tags
                {isEditedTags? (
                    <>
                        <ButtonGroup size="small" sx={{ml: 2}} disabled={isLoading} variant="outlined" aria-label="outlined primary button group">
                            <Button onClick={addNewTag} variant="outlined">
                                + Add
                            </Button>
                            <LoadingButton
                                loading={isLoading}
                                startIcon={<SaveIcon />}
                                onClick={saveEditedTags}
                                variant="contained"
                                color="primary"
                            >
                                Save
                            </LoadingButton>
                            <Button onClick={() => setEditedTags(tags)} variant="outlined" color="secondary">
                                Reset
                            </Button>
                            <Button onClick={() => setIsEditedTags(false)} variant="outlined" color="secondary">
                                Cancel
                            </Button>
                        </ButtonGroup>
                    </>
                ):
                    <Button
                    sx={{ml: 2}}
                    size="small"
                    variant="outlined"
                    disabled={isLoading}
                    onClick={() => handleTagEdit()}
                >
                    <SettingsIcon/>
                </Button>
                }

            </Typography>
            <List>
                {filteredTags.map((tag) => (
                    <ListItem key={tag.id} style={{padding: '1px'}}>
                        {isEditedTags ? (
                            <>
                                <TextField
                                    size="small"
                                    value={editedTags[tag.id]?.name || tag.name}
                                    onChange={(e) => handleTagEditChange(tag.id, 'name', e.target.value)}
                                    placeholder="Tag Name"
                                    sx={{marginRight: 2}}
                                />
                                <TextField
                                    size="small"
                                    value={editedTags[tag.id]?.description || tag.description}
                                    onChange={(e) => handleTagEditChange(tag.id, 'description', e.target.value)}
                                    placeholder="Description"
                                    sx={{marginRight: 2}}
                                />
                                 <IconButton onClick={() => deleteTag(tag.id)}>
                                    <DeleteForeverIcon/>
                                </IconButton>
                            </>
                        ) : (
                            <ListItemButton
                                key={tag.id}
                                onClick={() => handleTagSelect(tag)}
                                style={{ paddingTop: 0, paddingBottom: 0 }}
                            >
                                <ListItemIcon style={{ minWidth: 32 }}>
                                    {tagsSelected.includes(tag) ? <FilterAltIcon fontSize="small" /> : <FolderIcon fontSize="small" />}
                                </ListItemIcon>
                                <ListItemText
                                    primary={tag.name}
                                    secondary={tag.description}
                                />
                            </ListItemButton>
                        )}
                    </ListItem>
                ))}
            </List>

        </Paper>
    );
};
