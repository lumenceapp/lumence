import * as PluginsApiConstants from '@lumence/plugins/constants'
import * as PluginsApiUtils from '@lumence/plugins/utils'

export interface PluginApiPlugins {
    utils: typeof import('@lumence/plugins/utils')
    constants: typeof import('@lumence/plugins/constants')
}

export const plugins: PluginApiPlugins = {
    constants: PluginsApiConstants,
    utils: PluginsApiUtils,
}
