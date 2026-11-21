package app.lumence.plugins.external

import app.lumence.plugins.PluginError
import app.lumence.plugins.PluginErrorCodes
import app.lumence.plugins.PluginManifest
import app.lumence.plugins.pluginLog

// A plugin whose manifest parsed, but whose artifacts are not loaded yet.
//
// Platforms subclass this to carry where the plugin lives (a directory on Android, a bundle on iOS).
//
// Dependency resolution happens at [app.lumence.plugins.PluginDependencyGraph].
open class ParsedPlugin(val manifest: ExternalManifest)

class DiscoveryFailure(
    val manifest: PluginManifest?,
    val errors: List<PluginError>,
) {
    // If the plugin itself is at fault (bad code, bad manifest) rather than its environment (dependencies).
    // It'll get disabled instead of being skipped.
    val isPluginFault: Boolean
        get() = errors.any {
            it.code == PluginErrorCodes.LOAD_FAILED || it.code == PluginErrorCodes.MANIFEST_INVALID
        }
}

// Records a skipped plugin for [id] and logs.
fun MutableMap<String, DiscoveryFailure>.sessionSkip(
    id: String,
    manifest: PluginManifest?,
    errors: List<PluginError>,
) {
    this[id] = DiscoveryFailure(manifest, errors)
    pluginLog.e("Skipping external plugin '$id': ${errors.joinToString("; ") { it.message }}")
}
