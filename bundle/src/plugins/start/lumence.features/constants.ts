export const Setting = {
    LumenceFeaturesPerformance: 'LumenceFeaturesPerformance',
    LumenceFeaturesPerfOverlay: 'LumenceFeaturesPerfOverlay',
    LumenceFeaturesMessageToasts: 'LumenceFeaturesMessageToasts',
    LumenceFeaturesFilePreview: 'LumenceFeaturesFilePreview',
    LumenceFeaturesDebugLogs: 'LumenceFeaturesDebugLogs',
    LumenceFeaturesLogCapture: 'LumenceFeaturesLogCapture',
    LumenceFeaturesQuickReload: 'LumenceFeaturesQuickReload',
} as const

export const RouteNames = {
    [Setting.LumenceFeaturesPerformance]: 'Lumence Performance',
    [Setting.LumenceFeaturesFilePreview]: 'Lumence File Preview',
    [Setting.LumenceFeaturesDebugLogs]: 'Lumence Debug Logs',
} as const

export const PerfOverlayAppKey = 'LumencePerfOverlay'
