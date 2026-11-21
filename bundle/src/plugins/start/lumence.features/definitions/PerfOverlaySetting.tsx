import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { api } from '..'
import { setPerfOverlayEnabled } from '../perf'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceFeaturesPerfOverlaySetting: SettingsItem = {
    parent: null,
    type: 'toggle',
    IconComponent: () => <TableRowAssetIcon name="ListBulletsIcon" />,
    useTitle: () => 'Performance overlay',
    useDescription: () => 'Shows live frame stats over the running app.',
    useValue: () => api.jsonStorage.use()?.perfOverlay ?? false,
    onValueChange: value => {
        api.jsonStorage.set({ perfOverlay: value })
        setPerfOverlayEnabled(value)
    },
}

export default LumenceFeaturesPerfOverlaySetting
