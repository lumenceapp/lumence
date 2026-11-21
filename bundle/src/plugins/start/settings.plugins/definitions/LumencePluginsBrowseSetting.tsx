import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { RouteNames, Setting } from '../constants'
import defer * as LumencePluginsBrowseSettingScreen from '../screens/LumencePluginsBrowseSettingScreen'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumencePluginsBrowseSetting: SettingsItem = {
    parent: null,
    type: 'route',
    IconComponent: () => <TableRowAssetIcon name="PlusLargeIcon" />,
    useTitle: () => 'Browse Plugins',
    screen: {
        route: RouteNames[Setting.LumencePluginsBrowse],
        getComponent: () => LumencePluginsBrowseSettingScreen.default,
    },
}

export default LumencePluginsBrowseSetting
