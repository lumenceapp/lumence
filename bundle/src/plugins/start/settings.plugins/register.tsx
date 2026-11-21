import {
    addSettingsItemToSection,
    registerSettingsItems,
} from '@lumence/discord/modules/settings'
import { Setting } from './constants'
import LumencePluginsAdvancedSetting from './definitions/LumencePluginsAdvancedSetting'
import LumencePluginsBrowseSetting from './definitions/LumencePluginsBrowseSetting'
import LumencePluginsSetting from './definitions/LumencePluginsSetting'
import LumencePluginsUpdatesSetting from './definitions/LumencePluginsUpdatesSetting'

registerSettingsItems({
    [Setting.LumencePlugins]: LumencePluginsSetting,
    [Setting.LumencePluginsAdvanced]: LumencePluginsAdvancedSetting,
    [Setting.LumencePluginsBrowse]: LumencePluginsBrowseSetting,
    [Setting.LumencePluginsUpdates]: LumencePluginsUpdatesSetting,
})

// The settings plugin registers this section, and it always starts before us (we depend on it).
addSettingsItemToSection('LUMENCE', Setting.LumencePlugins, 1)
