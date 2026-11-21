import {
    refreshSettings,
    registerSettingsItems,
    registerSettingsSection,
} from '@lumence/discord/modules/settings'
import { Setting } from './constants'
import LumenceFeaturesDebugLogsSetting from './definitions/DebugLogsSetting'
import LumenceFeaturesFilePreviewSetting from './definitions/FilePreviewSetting'
import LumenceFeaturesLogCaptureSetting from './definitions/LogCaptureSetting'
import LumenceFeaturesMessageToastsSetting from './definitions/MessageToastsSetting'
import LumenceFeaturesPerfOverlaySetting from './definitions/PerfOverlaySetting'
import LumenceFeaturesPerformanceSetting from './definitions/PerformanceSetting'
import LumenceFeaturesQuickReloadSetting from './definitions/QuickReloadSetting'

registerSettingsItems({
    [Setting.LumenceFeaturesPerformance]: LumenceFeaturesPerformanceSetting,
    [Setting.LumenceFeaturesPerfOverlay]: LumenceFeaturesPerfOverlaySetting,
    [Setting.LumenceFeaturesMessageToasts]: LumenceFeaturesMessageToastsSetting,
    [Setting.LumenceFeaturesFilePreview]: LumenceFeaturesFilePreviewSetting,
    [Setting.LumenceFeaturesDebugLogs]: LumenceFeaturesDebugLogsSetting,
    [Setting.LumenceFeaturesLogCapture]: LumenceFeaturesLogCaptureSetting,
    [Setting.LumenceFeaturesQuickReload]: LumenceFeaturesQuickReloadSetting,
})

registerSettingsSection('LUMENCE_FEATURES', {
    label: 'Lumence Features',
    settings: [
        Setting.LumenceFeaturesPerformance,
        Setting.LumenceFeaturesPerfOverlay,
        Setting.LumenceFeaturesMessageToasts,
        Setting.LumenceFeaturesFilePreview,
        Setting.LumenceFeaturesDebugLogs,
        Setting.LumenceFeaturesLogCapture,
        Setting.LumenceFeaturesQuickReload,
    ],
    index: 1,
})

refreshSettings()
