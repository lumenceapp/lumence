import type { DiscordModules } from '.'

declare module '@lumence/plugins/types' {
    export interface InitPluginApi<O extends PluginApiExtensionsOptions> {
        logger: DiscordModules.Logger
    }
}
