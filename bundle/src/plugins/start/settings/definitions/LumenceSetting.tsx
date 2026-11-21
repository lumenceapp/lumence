import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { FullVersion } from '~/constants'
import LumenceIcon from '~assets/LumenceIcon'
import { RouteNames, Setting } from '../constants'
import defer * as LumenceSettingScreen from '../screens/LumenceSettingScreen'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceSetting: SettingsItem = {
    parent: null,
    type: 'route',
    IconComponent: () => <TableRowAssetIcon id={LumenceIcon} />,
    useTitle: () => 'Lumence',
    useTrailing: () => FullVersion,
    screen: {
        route: RouteNames[Setting.Lumence],
        getComponent: () => LumenceSettingScreen.default,
    },
}

export default LumenceSetting
