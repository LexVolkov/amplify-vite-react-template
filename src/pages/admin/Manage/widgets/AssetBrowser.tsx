import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {useEffect, useState} from "react";
import {generateClient} from "aws-amplify/data";
import CancelIcon from '@mui/icons-material/Cancel';
import AssetIcon from "../../../../components/AssetIcon.tsx";
import {Schema} from "../../../../../amplify/data/resource.ts";

const client = generateClient<Schema>();

interface AssetBrowserProps {
    value: string;
    onChange: (value: string) => void;
}
const AssetBrowser = ({value, onChange}: AssetBrowserProps) => {
    const [categories, setCategories] = useState<AssetCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [subCategories, setSubCategories] = useState<AssetSubCategory[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            const {data} = await client.models.AssetCategory.list();
            setCategories(data);
            setIsLoading(false);
        };
        loadCategories().then();
    }, []);
    const handleAssetSelect = (assetId: string) => {
        onChange(assetId);
    };
    const handleCategorySelect = async (categoryId: string) => {
        setIsLoading(true);
        try {
            const {data} = await client.models.AssetSubCategory.list({
                filter: {categoryId: {eq: categoryId}}
            });
            setSubCategories(data);
            setSelectedCategory(categoryId);
            setSelectedSubCategory(null);
            setAssets([]);
            setAvailableTags([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubCategorySelect = async (subCategoryId: string) => {
        setIsLoading(true);
        try {
            const {data: assetsData} = await client.models.AssetSubCategory.get(
                {id: subCategoryId},
                {selectionSet: ['assets.*', 'assets.tags.tag.*']}
            );
            const assets = assetsData?.assets || [];
            const tagsMap = new Map<string, Tag>();
            assets.forEach(asset => {
                asset.tags?.forEach(assetTag => {
                    if (assetTag.tag) {
                        tagsMap.set(assetTag.tag.id, assetTag.tag);
                    }
                });
            });

            setAssets(assets);
            setAvailableTags(Array.from(tagsMap.values()));
            setSelectedSubCategory(subCategoryId);
            setSelectedTags([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagSelect = (value: string | string[] ) => {
        setSelectedTags(value as string[]);
    };

    const filteredAssets = assets.filter(asset => {
        if (!selectedTags.length) return true;
        const assetTagIds = asset.tags?.map((tagObj:{tag: {id: string}}) => tagObj.tag?.id).filter(Boolean) as string[];
        return selectedTags.every(tagId => assetTagIds.includes(tagId));
    });

    return (
        <Box>
            <FormControl fullWidth margin="normal">
                <InputLabel>Категория</InputLabel>
                <Select
                    value={selectedCategory || ''}
                    onChange={(e) => handleCategorySelect(e.target.value as string)}
                    disabled={isLoading}
                >
                    {categories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Подкатегория</InputLabel>
                <Select
                    value={selectedSubCategory || ''}
                    onChange={(e) => handleSubCategorySelect(e.target.value as string)}
                    disabled={!selectedCategory || isLoading}
                >
                    {subCategories.map(subCategory => (
                        <MenuItem key={subCategory.id} value={subCategory.id}>
                            {subCategory.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Теги</InputLabel>
                <Select
                    multiple
                    value={selectedTags}
                    onChange={(e) => handleTagSelect(e.target.value)}
                    disabled={!selectedSubCategory || isLoading}
                    renderValue={(selected) => (
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                            {selected.map(tagId => {
                                const tag = availableTags.find(t => t.id === tagId);
                                return (
                                    <Chip
                                        key={tagId}
                                        label={tag?.name || tagId}
                                        onDelete={() => setSelectedTags(prev => prev.filter(id => id !== tagId))}
                                        deleteIcon={<CancelIcon/>}
                                    />
                                );
                            })}
                        </Box>
                    )}
                >
                    {availableTags.map(tag => (
                        <MenuItem key={tag.id} value={tag.id}>
                            {tag.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={2} marginTop={2}>
                {filteredAssets.map(asset => (
                    <Grid key={asset.id}>
                        <Box
                            onClick={() => handleAssetSelect(asset.id)}
                            sx={{
                                border: value === asset.id ? '2px solid #2196f3' : '1px solid #ddd',
                                borderRadius: 1,
                                padding: 1,
                                cursor: 'pointer',
                                position: 'relative',
                                width: 100,
                                height: 100,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <AssetIcon assetId={asset.id}/>

                            <Typography variant="caption" noWrap sx={{ marginTop: 1 }}>
                                {asset.name}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default AssetBrowser;