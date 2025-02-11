import React, { useEffect, useState } from 'react';
import HideImageIcon from '@mui/icons-material/HideImage';
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "../../amplify/data/resource.ts";
import { CircularProgress, Tooltip } from "@mui/material";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store.ts";

const client = generateClient<Schema>();

// In-memory кеши для изображений и ассетов
const imageCache = new Map<string, string>(); // Кеш для изображений (base64 или Blob URL)
const assetCache = new Map<string, Asset>(); // Кеш для данных ассетов
const loadingPromises = new Map<string, Promise<void>>(); // Кеш для промисов загрузки

const EXPIRES_IN = 60 * 60 * 24; // 24 часа в секундах

interface AnimatedIconProps {
    assetId?: string | null;
    path?: string | null;
    size?: number | null;
    fit?: boolean | null;
}

const AssetIcon: React.FC<AnimatedIconProps> = ({
                                                    path = null,
                                                    assetId = null,
                                                    size = null,
                                                    fit = null,
                                                }) => {
    const user = useSelector((state: RootState) => state.user);
    const [asset, setAsset] = useState<Asset>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const saveToLocalStorage = (key: string, url: string) => {
        const data = {
            url,
            expiresAt: Date.now() + EXPIRES_IN * 1000,
        };
        localStorage.setItem(key, JSON.stringify(data));
    };

    const getFromLocalStorage = (key: string): string | null => {
        const data = localStorage.getItem(key);
        if (!data) return null;

        const { url, expiresAt } = JSON.parse(data);
        if (Date.now() > expiresAt) {
            localStorage.removeItem(key);
            return null;
        }

        return url;
    };

    const checkImageAvailability = (url: string): Promise<boolean> => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(true); // Изображение загружено успешно
            img.onerror = () => resolve(false); // Ошибка загрузки изображения
        });
    };

    useEffect(() => {
        setImageSrc(null);
        if (!assetId && !path) return;
        const cacheKey = assetId ? `asset:${assetId}-${user.identityId}` : `path:${path}`;

        // Загружаем данные
        const loadData = async () => {
            try {
                setIsLoading(true);
                let url: string | null = null;

                if (path) {
                    const { url: fetchedUrl } = await getUrl({
                        path: path,
                        options: {
                            validateObjectExistence: true,
                            expiresIn: EXPIRES_IN,
                        }, });
                    url = fetchedUrl.toString();
                } else if (assetId) {
                    const { data: assetData } =
                        await client.models.Asset.get(
                            { id: assetId },
                            {authMode:user.authMode}
                        );
                    if (!assetData) throw new Error('Asset not found');

                    setAsset(assetData);
                    assetCache.set(assetId, assetData);

                    if (assetData.path) {
                        const { url: fetchedUrl } = await getUrl({
                            path: assetData.path,
                            options: {
                                validateObjectExistence: true,
                                expiresIn: EXPIRES_IN,
                            },
                        });
                        url = fetchedUrl.toString();
                    } else {
                        throw new Error('Asset path not found');
                    }
                }

                if (url) {
                    // Загружаем изображение и сохраняем его в кеше
                    const response = await fetch(url);
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);

                    imageCache.set(cacheKey, imageUrl);
                    saveToLocalStorage(cacheKey, url);
                    setImageSrc(imageUrl);
                } else {
                    throw new Error('URL not available');
                }
            } catch (err) {
                setError('Error: ' + (err instanceof Error ? err.message : String(err)));
            } finally {
                setIsLoading(false);
                loadingPromises.delete(cacheKey);
            }
        };

        // Если изображение уже в кеше, используем его
        if (imageCache.has(cacheKey)) {
            setImageSrc(imageCache.get(cacheKey)!);
            if (assetId && assetCache.has(assetId)) {
                setAsset(assetCache.get(assetId)!);
            }
            return;
        }

        // Проверяем localStorage
        const cachedUrl = getFromLocalStorage(cacheKey);
        if (cachedUrl) {
            setIsLoading(true);
            checkImageAvailability(cachedUrl).then(isAvailable => {
                if (isAvailable) {
                    setImageSrc(cachedUrl);
                    setIsLoading(false);
                } else {
                    localStorage.removeItem(cacheKey);
                    loadData().then();
                }
            });
            return;
        }

        // Если данные уже загружаются, ждем завершения
        if (loadingPromises.has(cacheKey)) {
            setIsLoading(true);
            loadingPromises.get(cacheKey)!.then(() => {
                setIsLoading(false);
                setImageSrc(imageCache.get(cacheKey)!);
                if (assetId && assetCache.has(assetId)) {
                    setAsset(assetCache.get(assetId)!);
                }
            });
            return;
        }



        const promise = loadData();
        loadingPromises.set(cacheKey, promise);
    }, [assetId, path]);

    if (isLoading) {
        return <CircularProgress style={{
            maxWidth: size ? size : '100%',
            maxHeight: size ? size : '100%',
            verticalAlign: 'middle',
        }} />;
    }

    if (!imageSrc) {
        return (
            <Tooltip title={error || 'No image available'}>
                <HideImageIcon style={{
                    maxWidth : size ? size : '100%',
                    maxHeight: size ? size : '100%',
                    verticalAlign: 'middle',
                    opacity: 0.5
                }} />
            </Tooltip>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={asset?.name || 'Asset'}
            style={{
                objectFit: fit ? 'cover' : 'scale-down',
                width: size ? size : '100%',
                height : size ? size : '100%',
                verticalAlign: 'middle'
            }}
        />
    );
};

export default AssetIcon;