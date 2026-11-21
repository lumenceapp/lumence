import { reloadApp } from '@lumence/modules/native/app'
import { BackHandler } from 'react-native'

const DoublePressWindow = 350

let lastPress = 0
let removeListener: (() => void) | undefined

export function setQuickReloadEnabled(enabled: boolean) {
    if (enabled === Boolean(removeListener)) return

    if (!enabled) {
        removeListener?.()
        removeListener = undefined
        lastPress = 0
        return
    }

    const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        event => {
            if (event.timeStamp - lastPress < DoublePressWindow) {
                lastPress = 0
                reloadApp()
                return true
            }

            lastPress = event.timeStamp
            return false
        },
    )

    removeListener = () => subscription.remove()
}
