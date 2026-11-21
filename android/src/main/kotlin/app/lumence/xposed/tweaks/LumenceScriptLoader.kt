package app.lumence.xposed.tweaks

import app.lumence.xposed.LumenceConstants
import app.lumence.xposed.tweak
import app.lumence.xposed.tweaks.base.InjectorScope
import app.lumence.xposed.tweaks.base.registerScriptInjector

// Loads the Lumence bundle shipped in this module's APK. Depends on [app.lumence.xposed.tweaks.base.scriptLoader].
//
// Debug builds can run preloads and a development bundle from [DevLoader] instead.
val lumenceScriptLoader by tweak {
    registerScriptInjector { scope: InjectorScope ->
        runLumenceScripts(scope)
    }
}

private fun runLumenceScripts(scope: InjectorScope) {
    val log = scope.tweakLog
    log.i("Running Lumence scripts...")

    try {
        val devBundle = DevLoader.awaitBundle()

        for (f in DevLoader.preloads()) {
            log.d("Running preload: ${f.absolutePath}")
            scope.runFile(f.absolutePath)
        }

        if (devBundle != null) {
            log.i("Loading development bundle: ${devBundle.absolutePath}")
            scope.runFile(devBundle.absolutePath)
        } else {
            scope.runAsset(LumenceConstants.BUNDLE_ASSET)
        }
    } catch (e: Throwable) {
        log.e("Unable to run Lumence scripts", e)
    }
}
