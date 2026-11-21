import type { AnyObject } from '@lumence/utils/types'
import type { JsonStorage, JsonStorageOptions } from '.'

declare module '@lumence/plugins/types' {
    export interface UnscopedPreInitPluginApi {
        jsonStorage: typeof import('@lumence/json-storage')
    }

    export interface PluginApiExtensionsOptions {
        jsonStorage?: AnyObject
    }

    export interface PluginOptions<O extends PluginApiExtensionsOptions> {
        jsonStorage?: JsonStorageOptions<NonNullable<O['jsonStorage']>> & {
            // File name (or relative path) of the storage document inside the
            // plugin's storage directory.
            //
            // @default 'storage.json'
            file?: string
        }
    }

    export interface InitPluginApi<O extends PluginApiExtensionsOptions> {
        // The plugin JSON storage.
        jsonStorage: JsonStorage<NonNullable<O['jsonStorage']>>
    }
}
