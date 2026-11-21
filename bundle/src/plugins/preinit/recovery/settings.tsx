import {
    onSettingsModulesLoaded,
    registerSettingsItem,
} from '@lumence/discord/modules/settings'
import { Setting } from '~plugins/start/settings/constants'
import LumenceEnterRecoveryModeSetting from './definitions/LumenceEnterRecoveryModeSetting'

onSettingsModulesLoaded(() => {
    registerSettingsItem(
        Setting.LumenceEnterRecoveryMode,
        LumenceEnterRecoveryModeSetting,
    )
})
