/// <reference path="../../../../types/globals.hidden.ts" />

import { hiddenApi } from '@lumence/hidden'
import { registerInternalPlugin } from '@lumence/plugins/_'
import manifest from './manifest.json'

const pluginHiddenApi = registerInternalPlugin(manifest, {
    preInit({ cleanup, unscoped }) {
        globalThis.lumence = unscoped
        unscoped.hidden = hiddenApi

        cleanup(() => {
            // biome-ignore lint/performance/noDelete: We want to remove the API completely
            delete globalThis.lumence
            // biome-ignore lint/performance/noDelete: We want to remove the API completely
            delete unscoped.hidden
        })
    },
})

export default pluginHiddenApi
