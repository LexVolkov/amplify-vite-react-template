import {useSelector} from 'react-redux';
import {RootState} from '../store';

export function useSettings() {
    const rawSettings = useSelector((state: RootState) => state.game.settings);

    // Собираем объект с предустановленными типами
    return {
        CoinsExp: getSettingValue(rawSettings, 'CoinsExp', 1),
        CoinsAdded: getSettingValue(rawSettings, 'CoinsAdded', 1),
        LevelUpgradeExp: getSettingValue(rawSettings, 'LevelUpgradeExp', 1),
        CoinIcon: getSettingValue(rawSettings, 'CoinIcon', ''),
        ExperienceIcon: getSettingValue(rawSettings, 'ExperienceIcon', ''),
        LevelIcon: getSettingValue(rawSettings, 'LevelIcon', ''),
        AssetsStorageRootFolder: getSettingValue(rawSettings, 'AssetsStorageRootFolder', 'assets'),

    };
}
function getSettingValue<T>(
    settings: Record<string, Setting>,
    key: string,
    defaultValue: T
): T {
    const setting = settings[key];
    if (!setting) {
        return defaultValue;
    }

    switch (setting.type) {
        case "number":
            return (Number(setting.value) || defaultValue) as T;
        case "boolean":
            return (setting.value.toLowerCase() === "true") as T;
        case "string":
        case "asset":
        case "color":
            return (setting.value || defaultValue) as T;
        default:
            return defaultValue;
    }
}