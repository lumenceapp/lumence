@file:OptIn(kotlinx.cinterop.ExperimentalForeignApi::class)

package app.lumence.ios

import app.lumence.plugins.PluginPaths
import app.lumence.plugins.repos.RepoStore
import app.lumence.plugins.repos.SourcesStore
import kotlinx.cinterop.ByteVar
import kotlinx.cinterop.CPointer
import kotlinx.cinterop.toKString
import okio.FileSystem
import okio.Path.Companion.toPath
import platform.Foundation.NSDocumentDirectory
import platform.Foundation.NSFileManager
import platform.Foundation.NSURL
import platform.Foundation.NSUserDomainMask

internal val pluginPaths: PluginPaths by lazy {
    val lumenceDir = lumenceDirectory()
    val paths = PluginPaths(FileSystem.SYSTEM, lumenceDir, rootOverride = lumenceDir / "plugins")
    RepoStore.ensureLoaded(paths)
    SourcesStore.ensureLoaded(paths)
    paths
}

private fun lumenceDirectory() = run {
    val documents = (NSFileManager.defaultManager
        .URLsForDirectory(NSDocumentDirectory, NSUserDomainMask)
        .lastOrNull() as? NSURL)?.path ?: error("No Documents directory available")
    "$documents/lumence".toPath()
}

internal fun pluginPath(url: CPointer<ByteVar>?, label: String): String {
    pluginPaths
    return url?.toKString() ?: error("missing $label")
}
