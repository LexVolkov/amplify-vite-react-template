import {useState} from 'react';
import {
    Container,
    Alert,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {CategorySelector} from "./widgets/CategorySelector.tsx";
import {TagsSelector} from "./widgets/TagsSelector.tsx";
import {AssetSelector} from "./widgets/AssetSelector.tsx";
//TODO если загрузить картинку, но не сохранять, она теряется
function AdminAssetPage() {
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [selectedAssetTagIds, setSelectedAssetTagIds] = useState<string[]>([]);
    const [assetTags, setAssetTags] = useState<Tag[]>([]);
    const [allTags, setAllTags] = useState<Tag[]>([]);
    const [error, setError] = useState<string | null>(null);

    return (
        <>
            <Container maxWidth="lg">
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Grid container spacing={4} >
                    <Grid size={12}>
                        <Typography variant="h4" gutterBottom>
                            Asset Management
                        </Typography>
                    </Grid>

                    <Grid size={12}>
                        <CategorySelector
                            onSubCategoryChange={setSelectedSubCategory}
                            onError={setError}
                            isItemEditable={true}
                        />
                    </Grid>

                    <Grid container spacing={2} size={12}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TagsSelector
                                tagIds={assetTags}
                                onTags={setAllTags}
                                onTagsSelect={setSelectedAssetTagIds}
                                onError={setError}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 8 }}>
                            <AssetSelector
                                tags={allTags}
                                selectedTagsIds={selectedAssetTagIds}
                                selectedSubCategoryId={selectedSubCategory}
                                onError={setError}
                                onLoadTags={setAssetTags}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Container>

            </>
    );
}

export default AdminAssetPage;
