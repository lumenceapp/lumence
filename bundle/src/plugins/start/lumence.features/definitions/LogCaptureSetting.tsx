import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { api } from '..'
import { setLogCaptureEnabled } from '../logs'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceFeaturesLogCaptureSetting: SettingsItem = {
    parent: null,
    type: 'toggle',
    IconComponent: () => <TableRowAssetIcon name="PaperIcon" />,
    useTitle: () => 'Log capture',
    useDescription: () =>
        'Captures native and plugin logs for the debug screen.',
    useValue: () => api.jsonStorage.use()?.logCapture ?? true,
    onValueChange: value => {
        api.jsonStorage.set({ logCapture: value })
        setLogCaptureEnabled(value)
    },
}

export default LumenceFeaturesLogCaptureSetting
