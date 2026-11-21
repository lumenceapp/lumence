import { lookupModule } from '@lumence/modules/finders'
import { withName } from '@lumence/modules/finders/filters'
import type { DiscordModules } from '@lumence/discord/types'
import type { Metro } from '@lumence/modules/types'

// ../discord_common/js/packages/logger/Logger.tsx
export const [Logger, LoggerModuleId] = lookupModule(
    withName<typeof DiscordModules.Logger>('Logger'),
) as [typeof DiscordModules.Logger, Metro.ModuleID]
