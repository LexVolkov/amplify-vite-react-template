import {FC, useEffect, useMemo, useState} from 'react';
import {
    Button, Paper, Typography, Skeleton,
    Box
} from '@mui/material';
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../../../amplify/data/resource.ts";
import AssetCard from "./AssetCard.tsx";
import ImageIcon from "@mui/icons-material/Image";

const client = generateClient<Schema>();



interface TagsSelectorProps {
    tags: Tag[];
    selectedTagsIds: string[];
    selectedSubCategoryId: string | '';
    onError: (error: string) => void;
    onLoadTags: (tags: Tag[]) => void;
}

export const AssetSelector: FC<TagsSelectorProps> = ({
                                                         tags,
                                                         onLoadTags,
                                                         onError,
                                                         selectedTagsIds,
                                                         selectedSubCategoryId,
                                                     }) => {

    const [assets, setAssets] = useState<Asset[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const uniqueTags = new Set(assets?.flatMap((asset) => asset.tags.map((tag:{ tag: Tag }) => tag.tag.id)) || []);
        onLoadTags(Array.from(uniqueTags));
    }, [assets, onLoadTags]);

    useEffect(() => {
        if (!selectedSubCategoryId) {
            setAssets([]);
            return;
        }
        const fetchAssets = async () => {
            setIsLoading(true);
            try {
                const {data: assetData} = await client.models.AssetSubCategory.get(
                    {id: selectedSubCategoryId},
                    {selectionSet: ['assets.*', 'assets.tags.tag.*']}
                );
                console.log('assets', assetData?.assets || [])

                setAssets(assetData?.assets || []);
            } catch (err) {
                onError('Error fetching assets and their types: ' + (err instanceof Error ? err.message : String(err)));
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssets().then();
    }, [selectedSubCategoryId]);

    const handleAddNewAsset = () => {
        const newAssetData  = {
            id: `temp-${Math.random().toString(36)}`,
            name: 'New Asset',
            path: '',
            description: '',
            tags: [],
            subCategoryId: selectedSubCategoryId,
        };
        const newAssetDataFiltered = [newAssetData, ...assets];
        setAssets(newAssetDataFiltered);
    };
    const handleUpdateAsset = (asset: Asset, prevAsset: Asset) => {
        const newAssetDataFiltered = assets.map((a) => (a.id === prevAsset.id? asset : a));
        setAssets(newAssetDataFiltered);
    };
    const handleDeleteAsset = (asset: Asset) => {
        const newAssetDataFiltered = assets.filter((a) => a.id !== asset.id);
        setAssets(newAssetDataFiltered);
    };
    const filteredAssets = useMemo(() => {
        if(selectedTagsIds.length === 0){
            return assets;
        }
        const filtered = assets.filter(asset =>
            asset.tags.some((tagObj:{ tag: Tag }) => selectedTagsIds.includes(tagObj.tag.id))
        );
        const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name));
        return sorted;
    }, [assets, selectedTagsIds]);

    return (
            <Paper sx={{p: 2}}>
                <Typography variant="h6" gutterBottom>
                    Assets
                    <Button
                        sx={{ml: 2}}
                        size={"small"}
                        variant={"outlined"}
                        disabled={!selectedSubCategoryId}
                        onClick={() => {
                             handleAddNewAsset()
                        }}>
                        Add new asset
                    </Button>
                </Typography>
                {isLoading ? <Skeleton animation="wave" variant="rounded" width={320} height={70}/> :
                    filteredAssets.length > 0 ? (
                            <Box sx={{flexGrow: 1}}>
                                {filteredAssets.map((asset, index) => (
                                    <Box key={asset.id || index} sx={{mb: 2}}>
                                        <AssetCard
                                            tags={tags}
                                            asset={asset}
                                            onUpdate={handleUpdateAsset}
                                            onDelete={handleDeleteAsset}
                                        />
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography color="text.secondary" align="center">
                                <ImageIcon/>
                            </Typography>
                        )
                    }
            </Paper>
    )
};