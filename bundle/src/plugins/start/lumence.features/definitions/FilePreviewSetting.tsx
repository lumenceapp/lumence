import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { RouteNames, Setting } from '../constants'
import defer * as FilePreviewScreen from '../screens/FilePreviewScreen'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceFeaturesFilePreviewSetting: SettingsItem = {
    parent: null,
    type: 'route',
    IconComponent: () => <TableRowAssetIcon name="FileIcon" />,
    useTitle: () => 'File preview',
    useDescription: () => 'Reads a local text file and displays its contents.',
    screen: {
        route: RouteNames[Setting.LumenceFeaturesFilePreview],
        getComponent: () => FilePreviewScreen.default,
    },
}

export default LumenceFeaturesFilePreviewSetting
