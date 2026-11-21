// Initialize init libraries
import '@lumence/react/init'
import '@lumence/json-storage/init'

import { onRunApplication } from '@lumence/react/native'
import { onError } from '~index'

const unsub = onRunApplication(() => {
    unsub()

    try {
        // @as-require
        import('./start')
    } catch (e) {
        onError(e)
    }
})

// Run all init plugins
// @as-require
import '~/plugins/init'
// @as-require
import '@lumence/plugins/init'
