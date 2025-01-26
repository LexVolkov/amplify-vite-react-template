import React, {useState, useEffect} from 'react';
import {FileUploader} from '@aws-amplify/ui-react-storage';
import {
    Box,
    Alert,
} from '@mui/material';
import {useSettings} from "../../../../redux/hooks/useSettings.ts";

interface AssetUploaderProps {
    uploadPath?: string;
    onUploadPaths?: (paths: string[]) => void;
}

export const AssetUploader: React.FC<AssetUploaderProps> = ({
                                                                uploadPath,
                                                                onUploadPaths
                                                            }) => {
    const settings = useSettings();
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Reset state when path changes
    useEffect(() => {
        setUploadedFiles([]);
        setError(null);
    }, []);
    useEffect(() => {
        onUploadPaths && onUploadPaths(uploadedFiles);
    }, [onUploadPaths, uploadedFiles]);

    if (!settings.AssetsStorageRootFolder) return (<>error setting</>);

    const handleUploadSuccess = async (event: { key?: string | undefined }) => {
        console.log('Successfully uploaded files: ', event.key)
        if(event){
            const fileKey = event.key;
            const newUploadFiles = [...uploadedFiles, fileKey || ''];
            setUploadedFiles(newUploadFiles);
        }
    };


    const getUploadPath = () => {
        const randomPath = generateRandomString(12); // Генерируем случайную строку длиной 10 символов
        return `${settings.AssetsStorageRootFolder}/${uploadPath ? uploadPath : 'unknown'}/${randomPath}-`;
    };

    return (
        <Box sx={{mb: 2}}>
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    {error}
                </Alert>
            )}
            <FileUploader
                acceptedFileTypes={['image/*']}
                path={getUploadPath()}
                maxFileCount={1}
                isResumable
                onUploadSuccess={(event: { key?: string | undefined }) => handleUploadSuccess(event)}
            />
        </Box>
    );
};
const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
