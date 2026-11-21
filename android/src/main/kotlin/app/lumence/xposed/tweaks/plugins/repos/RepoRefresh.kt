package app.lumence.xposed.tweaks.plugins.repos

import app.lumence.plugins.PluginErrorCodes
import app.lumence.plugins.PluginSystemError
import app.lumence.plugins.repos.RepoIndex
import app.lumence.plugins.repos.RepoStore
import app.lumence.plugins.repos.parseRepoIndex
import app.lumence.xposed.ETagFetchResult
import app.lumence.xposed.getWithETag
import app.lumence.xposed.httpClient

private const val REFRESH_TIMEOUT = 10_000L

// Refreshes one repository's cached index for a single source. A failed fetch or invalid index won't modify the cache.
//
// @return Returns the new index.
// @throws PluginSystemError if the repository is unknown, the cache is unreadable, or the index format is unsupported.
internal suspend fun refreshRepo(url: String): RepoIndex {
    if (RepoStore.list().none { it.url == url }) throw PluginSystemError(
        PluginErrorCodes.NOT_FOUND,
        "Unknown repository: '$url'"
    )

    val result = httpClient.getWithETag(
        url = url.trimEnd('/'),
        etag = RepoStore.cachedETag(url),
        timeoutMillis = REFRESH_TIMEOUT,
    )

    return when (result) {
        ETagFetchResult.NotModified ->
            RepoStore.cachedIndex(url)
                ?: throw PluginSystemError(
                    PluginErrorCodes.STORAGE_FAILED,
                    "Repository '$url' responded 304 but the cache is unreadable",
                )

        is ETagFetchResult.Fetched -> {
            val text = result.bytes.decodeToString()
            val index = parseRepoIndex(text, url, RepoStore.log)

            RepoStore.writeCachedIndex(url, text, result.etag)

            index
        }
    }
}
