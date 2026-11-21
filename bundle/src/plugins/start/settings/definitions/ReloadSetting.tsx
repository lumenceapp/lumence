import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { reloadApp } from '@lumence/modules/native/app'
import { Setting } from '../constants'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const ReloadSetting: SettingsItem = {
    parent: Setting.Lumence,
    IconComponent: () => <TableRowAssetIcon name="RetryIcon" />,
    useTitle: () => 'Reload App',
    onPress: () => {
        reloadApp()
    },
    type: 'pressable',
}

export default ReloadSetting
