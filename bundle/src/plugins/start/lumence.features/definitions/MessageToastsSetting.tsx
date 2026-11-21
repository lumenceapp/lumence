import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { api } from '..'
import { setMessageToastsEnabled } from '../toasts'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceFeaturesMessageToastsSetting: SettingsItem = {
    parent: null,
    type: 'toggle',
    IconComponent: () => <TableRowAssetIcon name="SendMessageIcon" />,
    useTitle: () => 'Message toasts',
    useDescription: () => 'Shows a toast for incoming messages with content.',
    useValue: () => api.jsonStorage.use()?.messageToasts ?? false,
    onValueChange: value => {
        api.jsonStorage.set({ messageToasts: value })
        setMessageToastsEnabled(value)
    },
}

export default LumenceFeaturesMessageToastsSetting
