export const Setting = {
    // MAIN SETTINGS

    Lumence: 'Lumence',

    // SUBSETTINGS

    LumenceSourceRepository: 'LumenceSourceRepository',
    LumenceLicense: 'LumenceLicense',
    Reload: 'Reload',
    LumenceDeveloperMode: 'LumenceDeveloperMode',
    LumenceEnterRecoveryMode: 'LumenceEnterRecoveryMode',

    LumenceVersion: 'LumenceVersion',
    ReactVersion: 'ReactVersion',
    ReactNativeVersion: 'ReactNativeVersion',
    HermesVersion: 'HermesVersion',
    LoaderVersion: 'LoaderVersion',
} as const

export const RouteNames = {
    [Setting.Lumence]: 'Lumence',
} as const
