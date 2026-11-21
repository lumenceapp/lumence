import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { api } from '..'
import { setQuickReloadEnabled } from '../quickReload'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceFeaturesQuickReloadSetting: SettingsItem = {
    parent: null,
    type: 'toggle',
    IconComponent: () => <TableRowAssetIcon name="RetryIcon" />,
    useTitle: () => 'Quick reload',
    useDescription: () => 'Reload the app by pressing back twice.',
    useValue: () => api.jsonStorage.use()?.quickReload ?? false,
    onValueChange: value => {
        api.jsonStorage.set({ quickReload: value })
        setQuickReloadEnabled(value)
    },
}

export default LumenceFeaturesQuickReloadSetting
