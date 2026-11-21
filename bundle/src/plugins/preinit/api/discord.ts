import { defineLazyProperty } from '@lumence/utils/object'
import type { InitPluginApi } from '@lumence/plugins/types'

export function init({
    decorate,
    unscoped: {
        discord: {
            common: {
                logger: { Logger },
            },
        },
    },
}: InitPluginApi) {
    decorate(plugin => {
        defineLazyProperty(
            plugin.api,
            'logger',
            () => new Logger(`Lumence > Plugins (${plugin.manifest.id})`),
        )
    })
}
