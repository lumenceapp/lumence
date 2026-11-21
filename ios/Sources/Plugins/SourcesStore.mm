#import "Plugins/SourcesStore.h"
#import "Constants.h"
#import "Logger.h"
#import "LumenceCoreBridge.h"

@implementation PluginSource

+ (instancetype)sourceWithRepo:(NSString *)repo channel:(NSString *)channel {
    PluginSource *s = [[PluginSource alloc] init];
    s->_repo = [repo copy];
    s->_channel = [channel copy] ?: REPO_CHANNEL_LATEST;
    return s;
}

@end

@implementation SourcesStore

+ (instancetype)sharedStore {
    static SourcesStore *store;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{ store = [[SourcesStore alloc] init]; });
    return store;
}

- (NSDictionary<NSString *, PluginSource *> *)ensureLoaded {
    return [self all];
}

- (NSDictionary<NSString *, PluginSource *> *)all {
    char *error = NULL;
    char *json = LumenceCore_SourcesStoreAll(&error);
    if (!json) {
        LumenceLog(@"Failed to read plugin sources: %@", LumenceCore_ConsumeError(error));
        return @{};
    }

    NSData *data = [LumenceCore_ConsumeString(json) dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *raw = data ? [NSJSONSerialization JSONObjectWithData:data options:0 error:nil] : nil;
    if (![raw isKindOfClass:[NSDictionary class]]) return @{};

    NSMutableDictionary<NSString *, PluginSource *> *loaded = [NSMutableDictionary dictionaryWithCapacity:raw.count];
    for (NSString *pluginId in raw) {
        NSDictionary *entry = raw[pluginId];
        if (![entry isKindOfClass:[NSDictionary class]]) continue;
        id repo = entry[@"repo"];
        id channel = entry[@"channel"];
        loaded[pluginId] = [PluginSource sourceWithRepo:[repo isKindOfClass:[NSString class]] ? repo : nil
                                                channel:[channel isKindOfClass:[NSString class]] ? channel : REPO_CHANNEL_LATEST];
    }
    return loaded;
}

- (nullable PluginSource *)get:(NSString *)pluginId {
    return [self all][pluginId];
}

- (void)set:(NSString *)pluginId source:(PluginSource *)source {
    NSDictionary *payload = @{
        @"repo": source.repo ?: [NSNull null],
        @"channel": source.channel ?: REPO_CHANNEL_LATEST,
    };
    NSData *data = [NSJSONSerialization dataWithJSONObject:payload options:0 error:nil];
    if (!data) return;
    NSString *json = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

    char *error = NULL;
    if (LumenceCore_SourcesStoreSet(pluginId.UTF8String, json.UTF8String, &error) != 0) {
        LumenceLog(@"Failed to save plugin source for '%@': %@", pluginId, LumenceCore_ConsumeError(error));
    }
}

- (void)remove:(NSString *)pluginId {
    char *error = NULL;
    if (LumenceCore_SourcesStoreRemove(pluginId.UTF8String, &error) != 0) {
        LumenceLog(@"Failed to remove plugin source for '%@': %@", pluginId, LumenceCore_ConsumeError(error));
    }
}

- (void)forgetRepos:(NSArray<NSString *> *)repoUrls {
    if (repoUrls.count == 0) return;
    NSData *data = [NSJSONSerialization dataWithJSONObject:repoUrls options:0 error:nil];
    if (!data) return;
    NSString *json = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];

    char *error = NULL;
    if (LumenceCore_SourcesStoreForgetRepos(json.UTF8String, &error) != 0) {
        LumenceLog(@"Failed to forget repository provenance: %@", LumenceCore_ConsumeError(error));
    }
}

@end

NSDictionary *SourcesStoreAll(void) {
    return [[SourcesStore sharedStore] all];
}

void SourcesStoreForgetRepos(NSArray<NSString *> *repoUrls) {
    [[SourcesStore sharedStore] forgetRepos:repoUrls];
}

void SourcesStoreRemove(NSString *pluginId) {
    [[SourcesStore sharedStore] remove:pluginId];
}

void SourcesStoreSet(NSString *pluginId, NSString * _Nullable repo, NSString * _Nullable channel) {
    [[SourcesStore sharedStore] set:pluginId
                            source:[PluginSource sourceWithRepo:repo channel:channel]];
}
