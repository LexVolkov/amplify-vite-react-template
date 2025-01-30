import React, {FC, useEffect, useState} from 'react';
import {
    IconButton,
    Box, Skeleton
} from '@mui/material';
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../../../amplify/data/resource.ts";
import {RichTreeView} from '@mui/x-tree-view/RichTreeView';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckIcon from '@mui/icons-material/Check';
import {useTreeItem2Utils} from '@mui/x-tree-view/hooks';
import {
    TreeItem2,
    TreeItem2Label,
    TreeItem2Props,
} from '@mui/x-tree-view/TreeItem2';
import {TreeItem2LabelInput} from '@mui/x-tree-view/TreeItem2LabelInput';
import {
    UseTreeItem2LabelInputSlotOwnProps,
    UseTreeItem2LabelSlotOwnProps,
} from '@mui/x-tree-view/useTreeItem2';

const ADD_CATEGORY = '...add category';
const ADD_SUB_CATEGORY = '...add subcategory';

const client = generateClient<Schema>();

interface CategorySelectorProps {
    onCategoryChange?: (categoryId: string) => void;
    onSubCategoryChange?: (subCategoryId: string) => void;
    onError?: (error: string) => void;
    isItemEditable?: boolean;
}

type TreeItemType = {
    id: string;
    label: string;
    children?: TreeItemType[];
    type: 'category' | 'subcategory';
};

export const CategorySelector:
    FC<CategorySelectorProps> = ({
                                     onError,
                                     onCategoryChange,
                                     onSubCategoryChange,
                                     isItemEditable = false
                                 }) => {
    const [treeItems, setTreeItems] = useState<TreeItemType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const {data: categories} = await client.models.AssetCategory.list(
                    {
                        selectionSet: [
                            'id',
                            'name',
                            'subCategory.name',
                            'subCategory.id']
                    }
                );

                const items = categories.map(category => ({
                    id: `category::${category.id}`,
                    label: category.name,
                    type: 'category' as const,
                    children: [
                        ...category.subCategory.map(sc => ({
                            id: `subcategory::${sc.id}`,
                            label: sc.name,
                            type: 'subcategory' as const,
                        })),
                        ...(isItemEditable ? [{
                            id: `add_subcategory::${category.id}`,
                            label: ADD_SUB_CATEGORY,
                            type: 'subcategory' as const,
                        }] : [])
                    ].filter(Boolean) // Удаляем пустые объекты
                }));
                if (isItemEditable) {
                    items.push({
                        id: `add_category::root`,
                        label: ADD_CATEGORY,
                        type: 'category' as const,
                        children: []
                    })
                }
                setTreeItems(items);
            } catch (err) {
                onError?.('Error fetching data: ' + (err instanceof Error ? err.message : String(err)));
            } finally {
                setIsLoading(false);
            }
        };
        fetchData().then();
    }, []);

    const handleNodeSelect = (_event: React.SyntheticEvent, nodeId: string) => {
        const [type, id] = nodeId.split('::');


        if (type === 'category') {
            onCategoryChange?.(id);
            onSubCategoryChange?.('');
        } else if (type === 'subcategory') {
            onSubCategoryChange?.(id);
        } else if (type === 'add_category') {
            handleAdd(nodeId).then();
        } else if (type === 'add_subcategory') {
            handleAdd(nodeId).then();
        }
    };

    const handleAdd = async (nodeId: string) => {
        const [type, id] = nodeId.split('::');

        const promptNewName = window.prompt(`Please enter new ${type} NAME:`);
        const newName = promptNewName?.trim();
        if (!newName || newName === '') return;

        try {
            setIsLoading(true);
            if (type === 'add_subcategory') {
                if (id === undefined || id === null || id === '') {
                    throw new Error('Parent category not found');
                }
                const {data, errors} = await client.models.AssetSubCategory.create({
                    name: newName,
                    categoryId: id
                });
                if (errors) {
                    throw new Error(errors.map(e => e.message).join(', '));
                }
                if (data === null) {
                    throw new Error('Error adding subcategory');
                }
                setTreeItems(prev =>
                    prev.map(item =>
                        item.id === `category::${id}`
                            ? {
                                ...item,
                                children: [
                                    {
                                        id: `subcategory::${data.id}`,
                                        label: newName,
                                        type: 'subcategory',
                                    },
                                    ...(item.children ? [...item.children] : []), // Копируем `children`, создавая новый массив
                                ],

                            }
                            : item
                    )
                );
            } else if (type === 'add_category') {
                const {data, errors} = await client.models.AssetCategory.create({
                    name: newName
                });
                if (errors) {
                    throw new Error(errors.map(e => e.message).join(', '));
                }
                if (data === null) {
                    throw new Error('Error adding category');
                }
                setTreeItems(prev => [{
                    id: `category::${data.id}`,
                    label: newName,
                    type: 'category',
                    children: [{
                        id: `add_subcategory::${data.id}`,
                        label: ADD_SUB_CATEGORY,
                        type: 'subcategory' as const,
                    }]
                }, ...prev,]);
            } else {
                throw new Error('Unknown type');
            }
        } catch (err) {
            onError?.('Error adding item: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = async (
        nodeId: string, newName: string
    ) => {

        setIsLoading(true);
        const [type, id] = nodeId.split('::');

        try {
            if (type === 'category') {
                const {errors} = await client.models.AssetCategory.update({id, name: newName});

                if (errors) {
                    throw new Error(errors.map(e => e.message).join(', '));
                }
                setTreeItems(prev => prev.map(item =>
                    item.id === nodeId
                        ? {...item, label: newName}
                        : item
                ));
            } else {
                const {errors} = await client.models.AssetSubCategory.update({id, name: newName});
                if (errors) {
                    throw new Error(errors.map(e => e.message).join(', '));
                }
                setTreeItems(prev => prev.map(category => ({
                    ...category,
                    children: category.children?.map(sub =>
                        sub.id === nodeId
                            ? {...sub, label: newName}
                            : sub
                    ) || []
                })));
            }
            return true;
        } catch (err) {
            onError?.('Error updating item: ' + (err instanceof Error ? err.message : String(err)));
            return false;
        } finally {
            setIsLoading(false);
        }

    };

    const handleDelete = async (nodeId: string) => {

        setIsLoading(true);
        const [type, id] = nodeId.split('::');

        try {
            if (type === 'category') {
                const targetCategory = treeItems.find(item => item?.id === nodeId);
                const targetCategoryChildren = targetCategory?.children;
                const filterTargetCategoryChildren = targetCategoryChildren?.filter((ch) => (ch.label !== ADD_SUB_CATEGORY))
                console.log(filterTargetCategoryChildren)
                if (filterTargetCategoryChildren && filterTargetCategoryChildren?.length > 0) {
                    throw new Error('Cannot delete category with subcategories');
                }
                const {errors} = await client.models.AssetCategory.delete({
                    id: id || '',
                });
                if (errors) {
                    throw new Error(errors.map(e => e.message).join(', '));
                }
                setTreeItems(prev => prev.filter(item => item.id !== nodeId));
            } else {
                const {data: assetData, errors: assetErrors} = await client.models.AssetSubCategory.get(
                    {id: id},
                    {selectionSet: ['assets.id']}
                );
                if (assetErrors) {
                    throw new Error(assetErrors.map(e => e.message).join(', '));
                }
                if (assetData && assetData.assets && assetData.assets.length > 0) {
                    throw new Error("Cannot delete subcategory with assets");
                }
                const {errors} = await client.models.AssetSubCategory.delete({id});
                if (errors) {
                    throw new Error(errors.map(e => e.message).join(', '));
                }
                setTreeItems(prev => prev.map(category => ({
                    ...category,
                    children: category.children?.filter(sub => sub.id !== nodeId) || []
                })));
            }
            onCategoryChange?.('');
            onSubCategoryChange?.('');
        } catch (err) {
            onError?.('Error deleting item: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setIsLoading(false);
        }
    };

    interface CustomLabelProps extends UseTreeItem2LabelSlotOwnProps {
        editable: boolean;
        editing: boolean;
        toggleItemEditing: () => void;
        itemClick: () => void;
    }

    function CustomLabel({
                             editing,
                             editable,
                             children,
                             toggleItemEditing,
                             itemClick,
                             ...other
                         }: CustomLabelProps) {
        return (
            <>
                <TreeItem2Label
                    {...other}
                    editable={editable}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        justifyContent: 'space-between',
                    }}
                    onClick={itemClick}
                >
                    {children}

                </TreeItem2Label>
                {editable ? (
                    (children !== ADD_SUB_CATEGORY
                        && children !== ADD_CATEGORY) &&
                    <IconButton
                        size="small"
                        onClick={toggleItemEditing}
                        sx={{color: 'text.secondary'}}
                    >
                        <EditOutlinedIcon fontSize="small"/>
                    </IconButton>
                ) : null}
                {editing && null}
            </>
        );
    }

    interface CustomLabelInputProps extends UseTreeItem2LabelInputSlotOwnProps {
        handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
        handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
        value: string;
    }

    function CustomLabelInput(props: Omit<CustomLabelInputProps, 'ref'>) {
        const {handleCancelItemLabelEditing, handleSaveItemLabel, value, ...other} =
            props;

        return (
            <>
                {isLoading ?
                    <Skeleton variant="text" sx={{fontSize: '1rem'}} width={'100%'} animation="wave" />
                    : (
                        <React.Fragment>
                            <TreeItem2LabelInput style={{backgroundColor: 'white'}} {...other} value={value}/>
                            <IconButton
                                color="success"
                                size="small"
                                onClick={(event: React.MouseEvent) => {
                                    handleSaveItemLabel(event, value);
                                }}
                            >
                                <CheckIcon fontSize="small"/>
                            </IconButton>
                            <IconButton color="error" size="small" onClick={handleCancelItemLabelEditing}>
                                <CloseRoundedIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    )
                }
            </>

        )
            ;
    }

    const CustomTreeItem2 = React.forwardRef(function CustomTreeItem2(
        props: TreeItem2Props,
        ref: React.Ref<HTMLLIElement>,
    ) {
        const {interactions, status} = useTreeItem2Utils({
            itemId: props.itemId,
            children: props.children,
        });

        const handleContentDoubleClick: UseTreeItem2LabelSlotOwnProps['onDoubleClick'] = (
            event,
        ) => {
            event.defaultMuiPrevented = true;
        };

        const handleInputBlur: UseTreeItem2LabelInputSlotOwnProps['onBlur'] = (event) => {
            event.defaultMuiPrevented = true;
        };

        const handleInputKeyDown: UseTreeItem2LabelInputSlotOwnProps['onKeyDown'] = (
            event,
        ) => {
            event.defaultMuiPrevented = true;
            if (event.key === 'Enter') {
                const target = event.target as HTMLInputElement;
                handleSave(event, target.value || '');
            }
        };

        const handleSave = (event: React.SyntheticEvent, newLabel: string) => {
            if (newLabel === '') {
                const confirmDelete = window.confirm('Are you sure you want to delete this category?');
                if (confirmDelete) {
                    handleDelete(props.itemId).then();
                } else {
                    interactions.handleCancelItemLabelEditing(event);
                }
            } else {
                handleEdit(props.itemId, newLabel)
                    .then((result) => {
                        if (result) {
                            interactions.handleSaveItemLabel(event, newLabel);
                        } else {
                            interactions.handleCancelItemLabelEditing(event);
                        }
                    });
            }


        };
        const handleItemClick = (
            event: React.SyntheticEvent) => {
            handleNodeSelect(event, props.itemId)
        }
        return (
            <TreeItem2
                {...props}
                ref={ref}
                slots={{label: CustomLabel, labelInput: CustomLabelInput}}
                slotProps={{
                    label: {
                        onDoubleClick: handleContentDoubleClick,
                        editable: status.editable,
                        editing: status.editing,
                        toggleItemEditing: interactions.toggleItemEditing,
                        itemClick: handleItemClick,
                    } as CustomLabelProps,
                    labelInput: {
                        onBlur: handleInputBlur,
                        onKeyDown: handleInputKeyDown,
                        handleCancelItemLabelEditing: interactions.handleCancelItemLabelEditing,
                        handleSaveItemLabel: handleSave,
                    } as CustomLabelInputProps,
                }}
            />
        );
    });
    if(treeItems.length === 0 && isLoading){
        return (
            <Skeleton variant="text" sx={{fontSize: '1rem'}} width={'100%'} animation="wave" />
        )
    }
    return (
        <Box sx={{minHeight: 10, position: 'relative'}}>
            <RichTreeView
                items={treeItems}
                experimentalFeatures={{labelEditing: true}}
                isItemEditable={isItemEditable}
                slots={{item: CustomTreeItem2}}
                sx={{p: 1}}
                expansionTrigger="iconContainer"
            />
        </Box>
    );
};