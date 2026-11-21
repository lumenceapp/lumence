import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { RouteNames, Setting } from '../constants'
import defer * as LumencePluginsAdvancedSettingScreen from '../screens/LumencePluginsAdvancedSettingScreen'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumencePluginsAdvancedSetting: SettingsItem = {
    parent: null,
    type: 'route',
    IconComponent: () => <TableRowAssetIcon name="SettingsIcon" />,
    useTitle: () => 'Advanced',
    screen: {
        route: RouteNames[Setting.LumencePluginsAdvanced],
        getComponent: () => LumencePluginsAdvancedSettingScreen.default,
    },
}

export default LumencePluginsAdvancedSetting
