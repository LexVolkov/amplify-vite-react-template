type SettingsType = {
    [key: string]: any;
    CoinsExp: SettingRecord;
    CoinsAdded: SettingRecord;
    LevelUpgradeExp: SettingRecord;
    ExperienceIcon: SettingRecord;
    LevelIcon: SettingRecord;
    CoinIcon: SettingRecord;
    AssetsStorageRootFolder: SettingRecord;
}
const defaultSettings: SettingsType = {
    CoinsExp: {value: 2, type: 'number', order: 1},
    CoinsAdded: {value: 3, type: 'number', order:2},
    LevelUpgradeExp: {value: 4, type: 'number', order:3},
    ExperienceIcon: {value: '', type: 'asset', order:4},
    LevelIcon: {value: '', type: 'asset', order:5},
    CoinIcon: {value: '', type: 'asset', order:6},
    AssetsStorageRootFolder: {value: 'assets', type: 'string', order:7},
}
export const GlobalSettings: SettingsType = defaultSettings;