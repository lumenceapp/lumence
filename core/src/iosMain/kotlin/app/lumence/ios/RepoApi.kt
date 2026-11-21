@file:OptIn(kotlin.experimental.ExperimentalNativeApi::class, kotlinx.cinterop.ExperimentalForeignApi::class)

package app.lumence.ios

import app.lumence.core.LumenceJson
import app.lumence.core.logger
import app.lumence.plugins.repos.RepoIndex
import app.lumence.plugins.repos.RepoStore
import app.lumence.plugins.repos.UserRepo
import app.lumence.plugins.repos.parseRepoIndex
import kotlinx.cinterop.ByteVar
import kotlinx.cinterop.CPointer
import kotlinx.cinterop.CPointerVarOf
import kotlinx.cinterop.toKString
import kotlinx.serialization.builtins.ListSerializer

@CName("LumenceCore_RepoIndexParse")
fun repoIndexParse(
    json: CPointer<ByteVar>?,
    repoUrl: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?,
): CPointer<ByteVar>? = guard(errorOut) {
    val parsed = parseRepoIndex(
        json = json?.toKString() ?: error("missing index JSON"),
        repoUrl = repoUrl?.toKString() ?: "",
        log = logger("RepoIndex"),
    )
    LumenceJson.encodeToString(RepoIndex.serializer(), parsed)
}

@CName("LumenceCore_RepoStoreList")
fun repoStoreList(errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?): CPointer<ByteVar>? = guard(errorOut) {
    pluginPaths
    LumenceJson.encodeToString(ListSerializer(UserRepo.serializer()), RepoStore.list())
}

@CName("LumenceCore_RepoStoreSet")
fun repoStoreSet(
    entriesJson: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?,
): Int = guardInt(errorOut) {
    pluginPaths
    val entries = LumenceJson.decodeFromString(
        ListSerializer(UserRepo.serializer()),
        entriesJson?.toKString() ?: error("missing repos JSON"),
    )
    RepoStore.set(entries)
}

@CName("LumenceCore_RepoStoreCacheDir")
fun repoStoreCacheDir(
    url: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?
): CPointer<ByteVar>? = guard(errorOut) {
    pluginPath(url, "repo URL").let { RepoStore.cacheDirFor(it).toString() }
}

@CName("LumenceCore_RepoStoreCachedIndexFile")
fun repoStoreCachedIndexFile(
    url: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?
): CPointer<ByteVar>? = guard(errorOut) {
    pluginPath(url, "repo URL").let { RepoStore.cachedIndexFile(it).toString() }
}

@CName("LumenceCore_RepoStoreCachedETagFile")
fun repoStoreCachedETagFile(
    url: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?
): CPointer<ByteVar>? = guard(errorOut) {
    pluginPath(url, "repo URL").let { RepoStore.cachedETagFile(it).toString() }
}
