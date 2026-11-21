import * as UtilsBitset from '@lumence/utils/bitset'
import * as UtilsCallback from '@lumence/utils/callback'
import defer * as UtilsDiscord from '@lumence/utils/discord'
import * as UtilsError from '@lumence/utils/error'
import * as UtilsModulesLazy from '@lumence/utils/modules/lazy'
import * as UtilsObject from '@lumence/utils/object'
import * as UtilsPromise from '@lumence/utils/promise'
import * as UtilsProxy from '@lumence/utils/proxy'
import * as UtilsReact from '@lumence/utils/react'
import * as UtilsTree from '@lumence/utils/tree'
import { guardIndexInitialized } from '.'
import type { PluginApiUtils } from '@lumence/utils/types'

export const utils = UtilsObject.defineLazyProperties(
    {
        bitset: UtilsBitset,
        callback: UtilsCallback,
        error: UtilsError,
        modules: { lazy: UtilsModulesLazy },
        object: UtilsObject,
        promise: UtilsPromise,
        proxy: UtilsProxy,
        tree: UtilsTree,
        react: UtilsReact,
    } as PluginApiUtils,
    {
        discord: () => {
            guardIndexInitialized('utils.discord')
            return UtilsDiscord
        },
    },
)
