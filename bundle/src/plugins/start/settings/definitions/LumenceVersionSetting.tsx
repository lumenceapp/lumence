import TableRowAssetIcon from '@lumence/components/TableRowAssetIcon'
import { BuildEnvironment, FullVersion } from '~/constants'
import LumenceIcon from '~assets/LumenceIcon'
import { Setting } from '../constants'
import { CopyableSetting } from './shared'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const LumenceVersionSetting: SettingsItem = CopyableSetting(
    {
        parent: Setting.Lumence,
        IconComponent: () => <TableRowAssetIcon id={LumenceIcon} />,
        useTitle: () => 'Lumence',
    },
    () => `${FullVersion} (${BuildEnvironment})`,
)

export default LumenceVersionSetting
