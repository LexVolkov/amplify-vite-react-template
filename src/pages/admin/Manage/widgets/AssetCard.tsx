// components/AssetCard.tsx
import React, {useEffect, useMemo, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Box,
    Alert,
    TextField,
    Chip,
    Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import {Schema} from "../../../../../amplify/data/resource.ts";
import AssetIcon from "../../../../components/AssetIcon.tsx";
import {generateClient} from "aws-amplify/api";
import {AssetUploader} from "../components/AssetUploader.tsx";
import HideImageIcon from "@mui/icons-material/HideImage";
import {remove} from 'aws-amplify/storage';
import Paper from "@mui/material/Paper";
import {CategorySelector} from "./CategorySelector.tsx";

const client = generateClient<Schema>();

interface AssetCardProps {
    tags: Tag[];
    asset: Asset;
    onUpdate: (asset: Asset, prevAsset: Asset | null) => void;
    onDelete: (asset: Asset) => void;
}

const AssetCard: React.FC<AssetCardProps> = ({
                                                 tags,
                                                 asset,
                                                 onUpdate,
                                                 onDelete,
                                             }) => {
    const [editedAsset, setEditedAsset] = useState<Asset>(asset);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openTagSelector, setOpenTagSelector] = useState(false);

    useEffect(() => {
        if (asset.id.startsWith('temp-')) {
            setIsEditing(true);
        }
    }, [asset]);

    const handleCreateAsset = async () => {

        try {
            setIsLoading(true)
            if (!editedAsset.subCategoryId) {
                throw new Error('Please select a sub category');
            }
            const {data: newAssetData, errors} = await client.models.Asset.create({
                    path: editedAsset.path || '',
                    name: editedAsset.name || '',
                    description: editedAsset.description || '',
                    subCategoryId: editedAsset.subCategoryId || '',
                },
                {selectionSet: ['id', 'path', 'name', 'description', 'tags.tag.*']});

            if (errors) {
                throw new Error(errors.map(e => e.message).join(', '));
            }

            if (newAssetData?.id) {
                await Promise.all(editedAsset.tags.map((tagItem: { tag: Tag }) =>
                    client.models.AssetTag.create({
                        assetId: newAssetData.id,
                        tagId: tagItem.tag.id,
                    })
                ));

                const {data: assetData} = await client.models.Asset.get(
                    {id: newAssetData.id},
                    {selectionSet: ['id','name', 'path','subCategoryId', 'description', 'tags.tag.*']}
                );
                console.log(assetData)
                setEditedAsset(assetData);
                onUpdate?.(assetData, asset);
            }
            // Reset form
            setIsEditing(false)

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error creating asset');
        } finally {
            setIsLoading(false);
        }
    };
    const handleUpdateAsset = async () => {
        if (editedAsset === asset) {
            setIsEditing(false)
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);

            // Обновление тегов
            const {data: existingAssetTags} = await client.models.AssetTag.list({
                filter: {assetId: {eq: asset.id}}
            });

            // Удаление старых связей
            await Promise.all(existingAssetTags.map(at =>
                client.models.AssetTag.delete({id: at.id})
            ));
            // Создание новых связей
            await Promise.all(editedAsset.tags.map((tagItem: { tag: Tag }) =>
                client.models.AssetTag.create({
                    assetId: asset.id,
                    tagId: tagItem.tag.id,
                })
            ));
            // Обновление данных актива
            const {data: updatedAssetData, errors} = await client.models.Asset.update({
                    id: editedAsset.id,
                    path: editedAsset.path || '',
                    name: editedAsset.name || 'Unknown',
                    description: editedAsset.description || '',
                    subCategoryId: editedAsset.subCategoryId || asset.subCategoryId || '',
                },
                {selectionSet: ['id', 'subCategoryId', 'path', 'name', 'description', 'tags.tag.*']});

            if (errors) {
                throw new Error(errors.map(e => e.message).join(', '));
            }
            setIsEditing(false)
            setEditedAsset(updatedAssetData);
            onUpdate?.(updatedAssetData, asset);
        } catch (err) {
            setError('Error editing asset: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteAsset = async () => {
        if (editedAsset.path) {
            await handleDeleteImage();
        }
        if (!editedAsset.id) {
            onDelete?.(asset);
            return;
        }

        try {
            setIsLoading(true);

            const {data: existingAssetTags} = await client.models.AssetTag.list({
                filter: {assetId: {eq: asset.id}}
            });
            await Promise.all(existingAssetTags.map(at =>
                client.models.AssetTag.delete({id: at.id})
            ));

            const {errors} = await client.models.Asset.delete({id: editedAsset.id});
            if (errors) {
                throw new Error(errors.map(e => e.message).join(', '));
            }
            onDelete?.(asset)
        } catch (err) {
            let errorMessage = 'Error deleting asset: ';
            if (err instanceof Error) {
                errorMessage += err.message;
            } else {
                errorMessage += String(err);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteImage = async () => {

        try {
            setIsLoading(true);
            const {path} = await remove({
                path: editedAsset.path,
            });
            if (path !== editedAsset.path) {
                throw new Error('Error deleting image');
            }
            setEditedAsset({...editedAsset, path: ''})
        } catch (err) {
            let errorMessage = 'Error deleting asset: ';
            if (err instanceof Error) {
                errorMessage += err.message;
            } else {
                errorMessage += String(err);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDeleteTag = (tagIdToDelete: string) => () => {
        setEditedAsset({
            ...editedAsset,
            tags: editedAsset.tags.filter((tagItem: { tag: Tag }) =>
                tagItem.tag.id !== tagIdToDelete)
        })
    }
    const handleAddTag = (tag: string) => {
        setEditedAsset({
            ...editedAsset,
            tags: [...editedAsset.tags, {tag: tag}]
        });
    }
    const renderTags = () =>
        editedAsset?.tags.map((tagItem: { tag: Tag }, index: number) => {
            const tag = tagItem.tag;
            return (
                <Tooltip title={tag?.description || ''} key={tag?.id || index}>
                    <Chip

                        sx={{mr: 0.5, cursor: 'pointer'}}
                        size="small"
                        label={tag?.name || 'error'}
                        onDelete={isEditing ? handleDeleteTag(tag.id) : undefined}
                    />
                </Tooltip>
            );
        });

    const renderMenuTags = () => {
        return (
            <Paper elevation={4} sx={{p: 0.5, top: 0, left: 0, right: 0, bottom: 0}}>
                {filteredTagsForAdding
                    .map((tag: Tag, index) => (
                        <Chip
                            sx={{margin: 0.1}}
                            size="small"
                            variant="outlined"
                            label={tag.name}
                            key={tag?.id || index}
                            onClick={() => {
                                handleAddTag(tag);
                                setOpenTagSelector(false)
                            }}
                        />

                    ))}
            </Paper>
        )
    }
    const filteredTagsForAdding = useMemo(() => {
        const tagIdsInEditedAsset = editedAsset.tags.map((tagItem: { tag: Tag }) => tagItem.tag.id);
        return tags.filter(t => !tagIdsInEditedAsset.includes(t.id));
    }, [editedAsset.tags, tags]);



    return (
        <Card
            sx={{
                maxWidth: 200,
                m: 1,
                '&:hover': {
                    boxShadow: 6
                }
            }}
        >
            <Box sx={{position: 'relative'}}>
                <Box
                    sx={{
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'darkgray',
                        objectFit: 'cover',
                        backgroundImage: `
                            linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0.2)),
                            linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.2) 75%, rgba(255, 255, 255, 0.2))
                        `,
                        backgroundSize: '20px 20px', // Размер квадратиков
                        backgroundPosition: '0 0, 10px 10px', // Смещение второй сетки
                    }}
                >
                    {isEditing  && !editedAsset?.path && !isLoading
                        ?
                        <AssetUploader
                            uploadPath={asset.subCategoryId}
                            onUploadPaths={
                                (paths) => {
                                    if(paths.length > 0){
                                        setEditedAsset({...editedAsset, path: paths[0]})
                                    }
                                }
                            }
                        />
                        :
                        <AssetIcon path={editedAsset?.path}/>
                    }

                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        borderRadius: 1,
                        display: 'flex',
                        gap: 1
                    }}
                >
                    {isEditing ? (
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    asset.id.startsWith('temp-')
                                        ? handleCreateAsset()
                                        : handleUpdateAsset();
                                }}
                                disabled={isLoading}
                            >
                                <SaveIcon fontSize="small"/>
                            </IconButton>
                        ) :
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            disabled={isLoading}
                        >
                            <EditIcon fontSize="small"/>
                        </IconButton>
                    }
                    {isEditing && editedAsset?.path ? (
                        <>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteImage().then();

                                }}
                                disabled={isLoading}
                            >
                                <HideImageIcon fontSize="small"/>
                            </IconButton>

                        </>
                    ) : null
                    }
                    {isEditing &&
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAsset().then();
                            }}
                            disabled={isLoading}
                        >
                            <DeleteIcon fontSize="small"/>
                        </IconButton>}

                </Box>
            </Box>
            <CardContent>
                {isEditing ? (
                    <>
                        Катигорія:
                        <CategorySelector
                            onSubCategoryChange={
                            (subCId) =>
                                setEditedAsset({
                                    ...editedAsset, subCategoryId: subCId
                                })}
                            onError={setError}
                        />
                        <TextField
                            fullWidth
                            label="Name"
                            value={editedAsset.name || ''}
                            onChange={(e) =>
                                setEditedAsset({...editedAsset, name: e.target.value})}
                            sx={{mt: 2}}
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={editedAsset.description || ''}
                            onChange={(e) =>
                                setEditedAsset({...editedAsset, description: e.target.value})}
                            sx={{mt: 2}}
                        />
                    </>

                ) : (
                    <>
                        <Typography variant="body1" color="text.secondary" noWrap>
                            {asset.name || 'No name'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                            {asset.description || 'No description'}
                        </Typography>
                    </>

                )}
                <Box sx={{mt: 0.5, display: 'inline-block'}}>
                    {renderTags()}

                    {isEditing && <Chip
                        size="small"
                        label={'+ tag'}
                        onClick={(event) => {
                            event.stopPropagation();
                            setOpenTagSelector(true);
                        }}
                    />}
                </Box>
                {openTagSelector && renderMenuTags()}

            </CardContent>
            {
                error && (
                    <Alert severity="error" sx={{mb: 2}} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )
            }
        </Card>
    )
        ;
};

export default AssetCard;