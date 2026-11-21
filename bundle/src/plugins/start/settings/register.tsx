import {
    registerSettingsItems,
    registerSettingsSection,
} from '@lumence/discord/modules/settings'
import { Setting } from './constants'
import HermesVersionSetting from './definitions/HermesVersionSetting'
import LoaderVersionSetting from './definitions/LoaderVersionSetting'
import ReactNativeVersionSetting from './definitions/ReactNativeVersionSetting'
import ReactVersionSetting from './definitions/ReactVersionSetting'
import ReloadSetting from './definitions/ReloadSetting'
import LumenceDeveloperModeSetting from './definitions/LumenceDeveloperModeSetting'
import LumenceLicenseSetting from './definitions/LumenceLicenseSetting'
import LumenceSetting from './definitions/LumenceSetting'
import LumenceSourceRepositorySetting from './definitions/LumenceSourceRepositorySetting'
import LumenceVersionSetting from './definitions/LumenceVersionSetting'

registerSettingsItems({
    [Setting.Lumence]: LumenceSetting,
    [Setting.LumenceSourceRepository]: LumenceSourceRepositorySetting,
    [Setting.LumenceLicense]: LumenceLicenseSetting,
    [Setting.Reload]: ReloadSetting,
    [Setting.LumenceDeveloperMode]: LumenceDeveloperModeSetting,
    [Setting.LumenceVersion]: LumenceVersionSetting,
    [Setting.ReactVersion]: ReactVersionSetting,
    [Setting.ReactNativeVersion]: ReactNativeVersionSetting,
    [Setting.HermesVersion]: HermesVersionSetting,
    [Setting.LoaderVersion]: LoaderVersionSetting,
})

registerSettingsSection('LUMENCE', {
    label: 'Lumence',
    settings: [Setting.Lumence],
})
