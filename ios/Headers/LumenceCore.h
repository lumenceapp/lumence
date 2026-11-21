#pragma once

#include <limits.h>

#ifdef __cplusplus
extern "C" {
#endif

#define LUMENCE_CORE_INVALID INT_MIN

char *LumenceCore_VersionParse(const char *value, char **errorOut);
int LumenceCore_VersionCompare(const char *a, const char *b);
char *LumenceCore_VersionRangeParse(const char *value, char **errorOut);
int LumenceCore_VersionRangeSatisfies(const char *range, const char *version);
char *LumenceCore_ManifestParse(const char *json, char **errorOut);

char *LumenceCore_RepoIndexParse(const char *json, const char *repoUrl, char **errorOut);
char *LumenceCore_RepoStoreList(char **errorOut);
int LumenceCore_RepoStoreSet(const char *entriesJson, char **errorOut);
char *LumenceCore_RepoStoreCacheDir(const char *url, char **errorOut);
char *LumenceCore_RepoStoreCachedIndexFile(const char *url, char **errorOut);
char *LumenceCore_RepoStoreCachedETagFile(const char *url, char **errorOut);

char *LumenceCore_SourcesStoreAll(char **errorOut);
int LumenceCore_SourcesStoreSet(const char *pluginId, const char *sourceJson, char **errorOut);
int LumenceCore_SourcesStoreRemove(const char *pluginId, char **errorOut);
int LumenceCore_SourcesStoreForgetRepos(const char *repoUrlsJson, char **errorOut);
char *LumenceCore_SourcesStoreSetHeld(const char *pluginId, int held, char **errorOut);

char *LumenceCore_ResolveInstall(const char *pluginId, const char *optionsJson,
                                  const char *installedJson, const char *installedDepsJson,
                                  char **errorOut);

char *LumenceCore_FindUpdates(const char *installedJson, const char *pendingJson,
                               const char *installedDepsJson, char **errorOut);

int LumenceCore_PluginIdIsValid(const char *id);

char *LumenceCore_Sha256Hex(const char *data, unsigned long long length, char **errorOut);

char *LumenceCore_PluginsLoadOrder(const char *manifestsJson, char **errorOut);

char *LumenceCore_RequiredDependents(const char *manifestsJson, const char *pluginId, char **errorOut);

char *LumenceCore_StagePluginZip(const char *zipPath, const char *tmpName, char **codeOut, char **errorOut);

char *LumenceCore_OrderPluginsByDependencies(const char *requestJson, char **errorOut);

char *LumenceCore_PluginStatesGetSlots(char **errorOut);
char *LumenceCore_PluginStatesRead(char **errorOut);
int LumenceCore_PluginStatesSetActiveSlot(const char *slot, int oneShot, char **errorOut);
char *LumenceCore_PluginStatesUpdate(const char *slot, const char *pluginId,
                                      const char *stateJson, char **errorOut);
int LumenceCore_PluginStatesActiveFlags(const char *pluginId, char **errorOut);
int LumenceCore_PluginStatesBootFlags(const char *pluginId, char **errorOut);
int LumenceCore_PluginStatesSetActiveFlags(const char *pluginId, int mask, char **errorOut);
int LumenceCore_PluginStatesRemoveAll(const char *pluginId, char **errorOut);
int LumenceCore_PluginStatesDefaultsBoot(void);
char *LumenceCore_PluginStatesBootSlot(char **errorOut);

void LumenceCore_FreeString(char *value);

#ifdef __cplusplus
}
#endif
