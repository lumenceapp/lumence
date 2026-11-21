export interface FeatureStorage {
    perfOverlay: boolean
    messageToasts: boolean
    logCapture: boolean
}

export const defaultFeatureStorage: FeatureStorage = {
    perfOverlay: false,
    messageToasts: false,
    logCapture: true,
}
