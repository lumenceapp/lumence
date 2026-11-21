import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { isDefaultsOnlyBoot } from '@lumence/plugins/_'
import { useEnabledPluginCountInActiveSlot } from '@lumence/plugins/_/react'
import { RouteNames, Setting } from '../constants'
import defer * as LumencePluginsSettingScreen from '../screens/LumencePluginsSettingScreen'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumencePluginsSetting: SettingsItem = {
    parent: null,
    type: 'route',
    IconComponent: () => <TableRowAssetIcon name="PuzzlePieceIcon" />,
    useTitle: () => 'Plugins',
    useTrailing: () =>
        `${useEnabledPluginCountInActiveSlot()} enabled` +
        (isDefaultsOnlyBoot ? ' (recovery)' : ''),
    screen: {
        route: RouteNames[Setting.LumencePlugins],
        getComponent: () => LumencePluginsSettingScreen.default,
    },
}

export default LumencePluginsSetting
