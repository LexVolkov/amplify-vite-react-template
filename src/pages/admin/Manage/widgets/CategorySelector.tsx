import {FC, useEffect, useState} from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    DialogActions,
    Button,
    DialogContent,
    TextField,
    Dialog,
    DialogTitle
} from '@mui/material';
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../../../amplify/data/resource.ts";
import Grid from '@mui/material/Grid2';

const client = generateClient<Schema>();

interface CategorySelectorProps {
    onCategoryChange?: (categoryId: string) => void;
    onSubCategoryChange?: (subCategoryId: string) => void;
    onError?: (error: string) => void;
}

export const CategorySelector: FC<CategorySelectorProps> = ({
                                                                onError,
                                                                onCategoryChange,
                                                                onSubCategoryChange,
                                                            }) => {
    const [categories, setCategories] = useState<AssetCategory[]>([]);
    const [subCategories, setSubCategories] = useState<AssetSubCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isSubCategoryDialogOpen, setIsSubCategoryDialogOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [categoryEdit, setCategoryEdit] = useState(false);
    const [subCategoryEdit, setSubCategoryEdit] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const { data: categoryData } = await client.models.AssetCategory.list();
                setCategories(categoryData);
            } catch (err) {
                onError?.('Error fetching categories: ' + (err instanceof Error ? err.message : String(err)));
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories().then();
    }, []);
    useEffect(() => {
        if (!selectedCategory) {
            setSubCategories([]);
            setSelectedSubCategory('');
            return;
        }
        const fetchSubCategories = async () => {
            setIsLoading(true);
            try {
                const { data: subCategoryData } = await client.models.AssetSubCategory.list({
                    filter: { categoryId: { eq: selectedCategory } },
                });
                setSubCategories(subCategoryData);
            } catch (err) {
                onError?.('Error fetching subcategories: ' + (err instanceof Error ? err.message : String(err)));
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubCategories().then();
    }, [selectedCategory]);

    const handleCategoryChange = (categoryId: string) => {
        if (categoryId === 'add') {
            setIsCategoryDialogOpen(true);
        } else if (categoryId === 'edit') {
            setNewCategoryName(categories.find(c => c.id === selectedCategory)?.name || '' );
            setCategoryEdit(true);
            setIsCategoryDialogOpen(true);
        } else  if (categoryId === 'delete') {
            const confirmDelete = window.confirm('Are you sure you want to delete this category?');
            if (confirmDelete) {
                handleDeleteCategory().then();
            }
        }else{
            setSelectedSubCategory('');
            onSubCategoryChange?.('');
            setSelectedCategory(categoryId);
            onCategoryChange?.(categoryId);

        }
    };
    const handleAddCategory = async () => {
        setIsLoading(true);
        setIsCategoryDialogOpen(false);

        if (!newCategoryName) return;
        try {
            const newCategoryData = await client.models.AssetCategory.create({
                name: newCategoryName,
            });
            setCategories((prev) => [...prev, newCategoryData.data]);
            setSelectedCategory(newCategoryData.data?.id || '')
        } catch (err) {
            onError?.('Error adding category: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setNewCategoryName('');
            setIsLoading(false);
        }
    };
    const handleEditCategory = async () => {
        setIsLoading(true);
        setIsCategoryDialogOpen(false);
        setCategoryEdit(false);
        try {
            const updatedCategoryData = await client.models.AssetCategory.update({
                id: selectedCategory,
                name: newCategoryName,
            });
            setCategories((prev) => prev.map(category =>
                category.id === selectedCategory ? updatedCategoryData.data : category
            ));
        } catch (err) {
            onError?.('Error editing category: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setNewCategoryName('');
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        if(!selectedCategory) return;
        if(subCategories.length > 0){
            onError?.("Cannot delete category with subcategories");
            return;
        }
        try {
            const categoryId:string | null = selectedCategory;
            setIsLoading(true);
            await client.models.AssetCategory.delete({ id: categoryId });
            setCategories((prev) => prev.filter(category => category.id !== categoryId));
        } catch (err) {
            onError?.('Error deleting category: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setSelectedCategory('')
            setIsLoading(false);
        }
    };
    const handleSubCategoryChange = (subCategoryId: string) => {
        if (subCategoryId === 'add') {
            setIsSubCategoryDialogOpen(true);
        } else if (subCategoryId === 'edit') {
            setNewSubCategoryName(subCategories.find(c => c.id === selectedSubCategory)?.name || '' );
            setSubCategoryEdit(true);
            setIsSubCategoryDialogOpen(true);
        } else  if (subCategoryId === 'delete') {
            const confirmDelete = window.confirm('Are you sure you want to delete this subcategory?');
            if (confirmDelete) {
                handleDeleteSubCategory().then();
            }
        }else{
            setSelectedSubCategory(subCategoryId);
            onSubCategoryChange?.(subCategoryId);
        }
    };
    const handleAddSubCategory = async () => {
        setIsLoading(true);
        setIsSubCategoryDialogOpen(false);

        if (!newSubCategoryName) return;
        try {
            const newSubCategoryData = await client.models.AssetSubCategory.create({
                name: newSubCategoryName,
                categoryId: selectedCategory
            });
            setSubCategories((prev) => [...prev, newSubCategoryData.data]);
            setSelectedSubCategory(newSubCategoryData.data?.id || '')
        } catch (err) {
            onError?.('Error adding subcategory: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setNewSubCategoryName('');
            setIsLoading(false);
        }
    };
    const handleEditSubCategory = async () => {
        setIsLoading(true);
        setIsSubCategoryDialogOpen(false);
        setSubCategoryEdit(false);
        try {
            const updatedSubCategoryData = await client.models.AssetSubCategory.update({
                id: selectedSubCategory,
                name: newSubCategoryName,
            });
            setSubCategories((prev) => prev.map(category =>
                category.id === selectedSubCategory ? updatedSubCategoryData.data : category
            ));
        } catch (err) {
            onError?.('Error editing subcategory: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setNewSubCategoryName('');
            setIsLoading(false);
        }
    };
    const handleDeleteSubCategory = async () => {
        setIsLoading(true);
        if(!selectedSubCategory) return;
        const subCategoryId:string | null = selectedSubCategory;
        try {
            const {data: assetData} = await client.models.AssetSubCategory.get(
                {id: subCategoryId},
                {selectionSet: ['assets.*']}
            );
            if(assetData && assetData.assets && assetData.assets.length > 0){
                onError?.("Cannot delete subcategory with assets");
                return;
            }
            await client.models.AssetSubCategory.delete({ id: subCategoryId });
            setSubCategories((prev) => prev.filter(sc => sc.id !== subCategoryId));
            setSelectedSubCategory('');
        } catch (err) {
            onError?.('Error deleting subcategory: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        disabled={isLoading}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {categories.map((category, index) => (
                            <MenuItem key={index} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                        <MenuItem value={"add"}>
                            Add category...
                        </MenuItem>
                        <MenuItem value={"edit"}>
                            Edit category...
                        </MenuItem>
                        <MenuItem value={"delete"}>
                            Delete category...
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6}}>
                <FormControl fullWidth>
                    <InputLabel>Subcategory</InputLabel>
                    <Select
                        value={selectedSubCategory}
                        onChange={(e) => handleSubCategoryChange(e.target.value)}
                        disabled={isLoading || !selectedCategory}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {subCategories.map((subCategory) => (
                            <MenuItem key={subCategory.id} value={subCategory.id}>
                                {subCategory.name}
                            </MenuItem>
                        ))}
                        <MenuItem value={"add"}>
                            Add subcategory...
                        </MenuItem>
                        <MenuItem value={"edit"}>
                            Edit subcategory...
                        </MenuItem>
                        <MenuItem value={"delete"}>
                            Delete subcategory...
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Dialog open={isCategoryDialogOpen} onClose={() => setIsCategoryDialogOpen(false)}>
                <DialogTitle>{categoryEdit?"Edit Category":"Add New Category"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        sx={{mt: 2}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                        if(categoryEdit){
                            handleEditCategory().then();
                        }else {
                            handleAddCategory().then();
                        }}}
                        sx={{mt: 1}}
                    >
                        {categoryEdit?"Save":"Add"}
                    </Button>
                    <Button onClick={() => setIsCategoryDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isSubCategoryDialogOpen} onClose={() => setIsSubCategoryDialogOpen(false)}>
                <DialogTitle>{subCategoryEdit?"Edit SubCategory":"Add New SubCategory"}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="SubCategory Name"
                        value={newSubCategoryName}
                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                        sx={{mt: 2}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            if(subCategoryEdit){
                                handleEditSubCategory().then();
                            }else {
                                handleAddSubCategory().then();
                            }}}
                        sx={{mt: 1}}
                    >
                        {subCategoryEdit?"Save":"Add"}
                    </Button>
                    <Button onClick={() => setIsSubCategoryDialogOpen(false)}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
};