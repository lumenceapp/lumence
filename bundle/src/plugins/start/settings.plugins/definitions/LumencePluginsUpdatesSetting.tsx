import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { RouteNames, Setting } from '../constants'
import defer * as LumencePluginsUpdatesSettingScreen from '../screens/LumencePluginsUpdatesSettingScreen'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumencePluginsUpdatesSetting: SettingsItem = {
    parent: null,
    type: 'route',
    IconComponent: () => <TableRowAssetIcon name="DownloadIcon" />,
    useTitle: () => 'Plugin Updates',
    screen: {
        route: RouteNames[Setting.LumencePluginsUpdates],
        getComponent: () => LumencePluginsUpdatesSettingScreen.default,
    },
}

export default LumencePluginsUpdatesSetting
