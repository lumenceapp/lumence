import { lookupModule } from '@lumence/modules/finders'
import { withProps } from '@lumence/modules/finders/filters'
import type { Metro } from '@lumence/modules/types'

// ../discord_common/js/packages/tokens/native.tsx
export const [Tokens, TokensModuleId] = lookupModule(withProps('RawColor')) as [
    any,
    Metro.ModuleID,
]
