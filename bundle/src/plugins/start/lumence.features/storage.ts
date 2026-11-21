export interface FeatureStorage {
    perfOverlay: boolean
    messageToasts: boolean
    logCapture: boolean
    quickReload: boolean
}

export const defaultFeatureStorage: FeatureStorage = {
    perfOverlay: false,
    messageToasts: false,
    logCapture: true,
    quickReload: false,
}
