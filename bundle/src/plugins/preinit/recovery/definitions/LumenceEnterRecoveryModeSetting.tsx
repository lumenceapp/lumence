import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { reloadApp } from '@lumence/modules/native/app'
import {
    isDefaultsOnlyBoot,
    requestNextBootDefaultsOnly,
} from '@lumence/plugins/_'
import { Setting } from '~plugins/start/settings/constants'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceEnterRecoveryModeSetting: SettingsItem = {
    parent: Setting.Lumence,
    type: 'pressable',
    useIsDisabled: () => isDefaultsOnlyBoot,
    useTitle: () => 'Enter Recovery Mode',
    useDescription: () =>
        isDefaultsOnlyBoot
            ? 'Currently in Recovery Mode. Reload to exit.'
            : 'Run Lumence with default plugins only for one boot. Use if plugins are causing issues.',
    IconComponent: () => <TableRowAssetIcon name="ShieldIcon" />,
    onPress: () => {
        requestNextBootDefaultsOnly()
        reloadApp()
    },
}

export default LumenceEnterRecoveryModeSetting
