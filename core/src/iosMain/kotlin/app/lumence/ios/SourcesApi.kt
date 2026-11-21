@file:OptIn(kotlin.experimental.ExperimentalNativeApi::class, kotlinx.cinterop.ExperimentalForeignApi::class)

package app.lumence.ios

import app.lumence.core.LumenceJson
import app.lumence.plugins.repos.PluginSource
import app.lumence.plugins.repos.SourcesStore
import kotlinx.cinterop.ByteVar
import kotlinx.cinterop.CPointer
import kotlinx.cinterop.CPointerVarOf
import kotlinx.cinterop.toKString
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.MapSerializer
import kotlinx.serialization.builtins.serializer

@CName("LumenceCore_SourcesStoreAll")
fun sourcesStoreAll(errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?): CPointer<ByteVar>? = guard(errorOut) {
    pluginPaths
    LumenceJson.encodeToString(
        MapSerializer(String.serializer(), PluginSource.serializer()),
        SourcesStore.all(),
    )
}

@CName("LumenceCore_SourcesStoreSet")
fun sourcesStoreSet(
    pluginId: CPointer<ByteVar>?,
    sourceJson: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?,
): Int = guardInt(errorOut) {
    pluginPaths
    val id = pluginId?.toKString() ?: error("missing plugin id")
    val source =
        sourceJson?.toKString()?.let { LumenceJson.decodeFromString(PluginSource.serializer(), it) } ?: PluginSource()
    SourcesStore.set(id, source)
}

@CName("LumenceCore_SourcesStoreRemove")
fun sourcesStoreRemove(
    pluginId: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?,
): Int = guardInt(errorOut) {
    pluginPaths
    SourcesStore.remove(pluginId?.toKString() ?: error("missing plugin id"))
}

@CName("LumenceCore_SourcesStoreForgetRepos")
fun sourcesStoreForgetRepos(
    repoUrlsJson: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?,
): Int = guardInt(errorOut) {
    pluginPaths
    val urls = LumenceJson.decodeFromString(
        ListSerializer(String.serializer()),
        repoUrlsJson?.toKString() ?: error("missing repo URLs JSON"),
    )
    SourcesStore.forgetRepos(urls)
}

@CName("LumenceCore_SourcesStoreSetHeld")
fun sourcesStoreSetHeld(
    pluginId: CPointer<ByteVar>?,
    held: Int,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?,
): CPointer<ByteVar>? = guard(errorOut) {
    pluginPaths
    val id = pluginId?.toKString() ?: error("missing plugin id")
    val updated = SourcesStore.setHeld(id, held != 0)
    LumenceJson.encodeToString(PluginSource.serializer(), updated)
}
