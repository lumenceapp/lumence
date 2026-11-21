import { callNativeMethodSync } from '@lumence/modules/native'

export function reloadApp() {
    callNativeMethodSync('lumence.app.reload', [])
}

declare module '@lumence/modules/native' {
    interface NativeMethods {
        'lumence.app.reload': [[], null]
    }
}
