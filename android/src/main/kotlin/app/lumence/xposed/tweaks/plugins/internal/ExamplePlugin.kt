package app.lumence.xposed.tweaks.plugins.internal

import app.lumence.plugins.API_VERSION
import app.lumence.plugins.PluginManifest
import app.lumence.xposed.api.registerNativeMethod

private val manifest = PluginManifest(
    id = "lumence.example",
    name = "Example Plugin",
    description = "Example plugin.",
    author = "Lumence",
    version = API_VERSION,
)

internal val examplePlugin =
    internalPlugin(manifest, setOf(InternalPluginFlags.INTERNAL, InternalPluginFlags.ESSENTIAL)) {
        start {
            log.i("started in ${appInfo.packageName}")
            registerNativeMethod("lumence.example.test") { args ->
                log.i("lumence.example.test($args)")
                null
            }

            registerNativeMethod("lumence.example.test.error") {
                errors.tryEmit(Exception("Test exception!"))
            }
        }
    }