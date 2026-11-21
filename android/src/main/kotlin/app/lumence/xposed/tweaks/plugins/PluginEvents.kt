package app.lumence.xposed.tweaks.plugins

import app.lumence.plugins.PluginFlags
import app.lumence.plugins.pluginLog
import app.lumence.plugins.toJSPayload
import app.lumence.xposed.api.HostScope
import app.lumence.xposed.api.callJSMethod
import app.lumence.xposed.runSuspendCatching
import kotlin.time.Duration.Companion.seconds
import kotlinx.coroutines.launch
import kotlinx.coroutines.withTimeout

internal object PluginEvents {
    const val DOWNLOAD_PROGRESS = "lumence.plugins.events.downloadProgress"
    const val PLUGIN_INSTALL_FILE_READY = "lumence.plugins.events.pluginInstallFileReady"
    const val PLUGIN_INSTALL_RESULT = "lumence.plugins.events.pluginInstallResult"
    const val PLUGIN_UPDATED = "lumence.plugins.events.pluginUpdated"
    const val PLUGIN_ERRORED = "lumence.plugins.events.pluginErrored"
    const val REPO_STATE_UPDATE = "lumence.plugins.events.repoStateUpdate"

    // The dependency graph changed.
    const val DEPENDENCIES_UPDATED = "lumence.plugins.events.dependenciesUpdated"
}

private const val STATE_UPDATE = "lumence.plugins.states.update"

// Asks JS to tear a plugin's JS half down, for a stop native started.
private const val PLUGIN_STOPPING = "lumence.plugins.stopping"

// How long JS gets to tear its half down before native stops waiting.
// While JS max stop wait time is 5s, native has to wait for the parallel cascade to finish, which all takes ~10s.
private val JS_STOP_TIMEOUT = 10.seconds

// Let JS tear down [pluginId], and to cascade, before native tears down its own.
//
// If timeout exceeds, native **must still stop** the plugin and its dependents regardless.
//
// @return Whether JS successfully stopped the plugin in time.
context(host: HostScope)
internal suspend fun letJSStopPluginFirst(pluginId: String): Boolean =
    host.bridge.isReady && runSuspendCatching {
        withTimeout(JS_STOP_TIMEOUT) { host.callJSMethod(PLUGIN_STOPPING, listOf(pluginId)) }
    }
        .onFailure { pluginLog.w("JS failed to stop $pluginId in time; stopping the native half anyway", it) }
        .isSuccess

context(host: HostScope)
internal fun emitPluginEvent(name: String, payload: Map<String, Any?>) {
    pluginJobScope.launch {
        runSuspendCatching { host.callJSMethod(name, listOf(payload)) }
            .onFailure { pluginLog.e("Failed to emit $name", it) }
    }
}

// Tells JS the dependency graph has updated.
context(host: HostScope)
internal fun emitDependencyGraphUpdate() {
    val graph = pluginRegistry.dependencies
    emitPluginEvent(
        PluginEvents.DEPENDENCIES_UPDATED,
        mapOf(
            "unsatisfiedOptionalDependencies" to pluginRegistry.factories.keys
                .associateWith { graph.unsatisfiedOptionalDependencies(it).toList() },
        ),
    )
}

// Tells JS a plugin's flags changed in [slotId].
context(host: HostScope)
internal suspend fun sendStateToJS(slotId: String, pluginId: String, flags: Set<PluginFlags>) {
    runSuspendCatching { host.callJSMethod(STATE_UPDATE, listOf(slotId, pluginId, flags.toJSPayload())) }
        .onFailure { pluginLog.e("Failed to send state of $pluginId in slot '$slotId'", it) }
}
