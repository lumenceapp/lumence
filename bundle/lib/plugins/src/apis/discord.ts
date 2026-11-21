import defer * as DiscordActions from '@lumence/discord/actions'
import defer * as DiscordCommonConstants from '@lumence/discord/common/constants'
import defer * as DiscordCommonFlux from '@lumence/discord/common/flux'
import defer * as DiscordCommonLogger from '@lumence/discord/common/logger'
import defer * as DiscordCommonTokens from '@lumence/discord/common/tokens'
import defer * as DiscordDesign from '@lumence/discord/design'
import defer * as DiscordFlux from '@lumence/discord/flux'
import defer * as DiscordModulesMainTabsV2 from '@lumence/discord/modules/main_tabs_v2'
import defer * as DiscordNative from '@lumence/discord/native'
import defer * as DiscordUtilsFinders from '@lumence/discord/utils/modules/finders'
import defer * as DiscordUtilsMetroSubscriptions from '@lumence/discord/utils/modules/metro/subscriptions'
import { defineLazyProperties } from '@lumence/utils/object'
import { withResolvedReads } from '@lumence/utils/proxy'
import { guardIndexInitialized } from '.'

export interface PreInitPluginApiDiscord {
    actions: PluginApiDiscord.Actions
    common: PreInitPluginApiDiscordCommon
    design: PluginApiDiscord.Design
    flux: PluginApiDiscord.Flux
    modules: PluginApiDiscord.Modules
    native: PluginApiDiscord.Native
    utils: PluginApiDiscord.Utils
}

export interface InitPluginApiDiscord extends PreInitPluginApiDiscord {
    common: InitPluginApiDiscordCommon
}

interface PreInitPluginApiDiscordCommon {
    appStartPerformance: typeof import('@lumence/discord/common/app-start-performance')
    importTracker: typeof import('@lumence/discord/common/import-tracker')
    utils: typeof import('@lumence/discord/common/utils')
    // This API is available in and after the `init` phase.
    constants: unknown
    // This API is available in and after the `init` phase.
    flux: unknown
    // This API is available in and after the `init` phase.
    logger: unknown
    // This API is available in and after the `init` phase.
    tokens: unknown
}

interface InitPluginApiDiscordCommon extends PreInitPluginApiDiscordCommon {
    constants: typeof import('@lumence/discord/common/constants')
    flux: typeof import('@lumence/discord/common/flux')
    logger: typeof import('@lumence/discord/common/logger')
    tokens: typeof import('@lumence/discord/common/tokens')
}

export type PluginApiDiscord = PreInitPluginApiDiscord | InitPluginApiDiscord

export namespace PluginApiDiscord {
    export type Actions = typeof import('@lumence/discord/actions')
    export type Common =
        | PreInitPluginApiDiscordCommon
        | InitPluginApiDiscordCommon
    export type Design = typeof import('@lumence/discord/design')
    export type Flux = typeof import('@lumence/discord/flux')
    export type Native = typeof import('@lumence/discord/native')

    export interface Utils {
        modules: {
            finders: typeof import('@lumence/discord/utils/modules/finders')
            metro: {
                subscriptions: typeof import('@lumence/discord/utils/modules/metro/subscriptions')
            }
        }
    }

    export interface Modules {
        mainTabsV2: typeof import('@lumence/discord/modules/main_tabs_v2')
        settings: typeof import('@lumence/discord/modules/settings') & {
            renderer: typeof import('@lumence/discord/modules/settings/renderer')
        }
    }
}

export const discord = defineLazyProperties(
    {
        common: defineLazyProperties(
            {
                appStartPerformance: require('@lumence/discord/common/app-start-performance'),
                importTracker: require('@lumence/discord/common/import-tracker'),
                utils: require('@lumence/discord/common/utils'),
            } as InitPluginApiDiscordCommon,
            {
                constants: () => {
                    guardIndexInitialized('Discord.common.constants')
                    return DiscordCommonConstants
                },
                flux: () => {
                    guardIndexInitialized('Discord.common.flux')
                    return DiscordCommonFlux
                },
                logger: () => {
                    guardIndexInitialized('Discord.common.logger')
                    return DiscordCommonLogger
                },
                tokens: () => {
                    guardIndexInitialized('Discord.common.tokens')
                    return DiscordCommonTokens
                },
            },
        ),
        modules: defineLazyProperties({} as PluginApiDiscord.Modules, {
            mainTabsV2: () => {
                return DiscordModulesMainTabsV2
            },
            settings: () => ({
                ...require('@lumence/discord/modules/settings'),
                renderer: require('@lumence/discord/modules/settings/renderer'),
            }),
        }),
        utils: {
            modules: {
                finders: DiscordUtilsFinders,
                metro: {
                    subscriptions: DiscordUtilsMetroSubscriptions,
                },
            },
        },
    } as PluginApiDiscord,
    {
        actions: () => {
            guardIndexInitialized('Discord.actions')
            return withResolvedReads(DiscordActions, {
                ActionSheetActionCreatorsModuleId: 'ActionSheetActionCreators',
                AlertActionCreatorsModuleId: 'AlertActionCreators',
                ToastActionCreatorsModuleId: 'ToastActionCreators',
            })
        },
        flux: () => {
            return DiscordFlux
        },
        design: () => {
            guardIndexInitialized('Discord.design')
            return DiscordDesign
        },
        native: () => {
            return DiscordNative
        },
    },
)
