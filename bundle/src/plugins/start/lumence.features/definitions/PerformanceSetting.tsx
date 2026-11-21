import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { RouteNames, Setting } from '../constants'
import defer * as PerformanceScreen from '../screens/PerformanceScreen'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceFeaturesPerformanceSetting: SettingsItem = {
    parent: null,
    type: 'route',
    IconComponent: () => <TableRowAssetIcon name="ScienceIcon" />,
    useTitle: () => 'Performance',
    useDescription: () =>
        'Shows frame timing, FPS and optional Hermes heap details.',
    screen: {
        route: RouteNames[Setting.LumenceFeaturesPerformance],
        getComponent: () => PerformanceScreen.default,
    },
}

export default LumenceFeaturesPerformanceSetting
