import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { RouteNames, Setting } from '../constants'
import defer * as DebugLogsScreen from '../screens/DebugLogsScreen'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceFeaturesDebugLogsSetting: SettingsItem = {
    parent: null,
    type: 'route',
    IconComponent: () => <TableRowAssetIcon name="TranscriptOutlineIcon" />,
    useTitle: () => 'Debug logs',
    useDescription: () => 'Shows logs captured from the running client.',
    screen: {
        route: RouteNames[Setting.LumenceFeaturesDebugLogs],
        getComponent: () => DebugLogsScreen.default,
    },
}

export default LumenceFeaturesDebugLogsSetting
