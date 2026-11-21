import { onSettingsModulesLoaded } from '@lumence/discord/modules/settings'
import { registerInternalPlugin } from '@lumence/plugins/_'
import PerfOverlay from './components/PerfOverlay'
import { setLogCaptureEnabled } from './logs'
import manifest from './manifest.json'
import {
    disposePerfOverlay,
    setPerfOverlayComponent,
    setPerfOverlayEnabled,
} from './perf'
import { setQuickReloadEnabled } from './quickReload'
import { defaultFeatureStorage } from './storage'
import { setMessageToastsEnabled } from './toasts'
import type { PluginApi } from '@lumence/plugins/types'
import type { FeatureStorage } from './storage'

export let api: PluginApi<{ jsonStorage: FeatureStorage }>

registerInternalPlugin<{ jsonStorage: FeatureStorage }>(manifest, {
    jsonStorage: {
        load: true,
        default: defaultFeatureStorage,
    },
    async start(api_) {
        api = api_
        setPerfOverlayComponent(PerfOverlay)

        const settings = await api.jsonStorage.get()
        setPerfOverlayEnabled(settings.perfOverlay)
        setMessageToastsEnabled(settings.messageToasts)
        setLogCaptureEnabled(settings.logCapture)
        setQuickReloadEnabled(settings.quickReload)

        const unsubscribeSettings = onSettingsModulesLoaded(() => {
            // @as-require
            import('./register')
        })

        api.cleanup(unsubscribeSettings)
    },
    stop() {
        setPerfOverlayEnabled(false)
        setMessageToastsEnabled(false)
        setLogCaptureEnabled(false)
        setQuickReloadEnabled(false)
        disposePerfOverlay()
    },
})
