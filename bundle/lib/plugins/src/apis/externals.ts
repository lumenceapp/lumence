import defer * as Browserify from '@lumence/externals/browserify'
import defer * as Gorhom from '@lumence/externals/gorhom'
import defer * as ReactNativeClipboard from '@lumence/externals/react-native-clipboard'
import defer * as ReactNativeCommunity from '@lumence/externals/react-native-community'
import defer * as ReactNativeSafeAreaContext from '@lumence/externals/react-native-safe-area-context'
import defer * as ReactNavigation from '@lumence/externals/react-navigation'
import defer * as Shopify from '@lumence/externals/shopify'
import defer * as Zustand from '@lumence/externals/zustand'
import { defineLazyProperties } from '@lumence/utils/object'

export interface PluginApiExternals {
    Browserify: typeof import('@lumence/externals/browserify')
    Gorhom: typeof import('@lumence/externals/gorhom')
    ReactNativeClipboard: typeof import('@lumence/externals/react-native-clipboard')
    ReactNativeCommunity: typeof import('@lumence/externals/react-native-community')
    ReactNativeSafeAreaContext: typeof import('@lumence/externals/react-native-safe-area-context')
    ReactNavigation: typeof import('@lumence/externals/react-navigation')
    Shopify: typeof import('@lumence/externals/shopify')
    Zustand: typeof import('@lumence/externals/zustand')
}

export const externals: PluginApiExternals = defineLazyProperties(
    {} as PluginApiExternals,
    {
        Browserify: () => {
            return Browserify
        },
        Gorhom: () => {
            return Gorhom
        },
        ReactNativeClipboard: () => {
            return ReactNativeClipboard
        },
        ReactNativeCommunity: () => {
            return ReactNativeCommunity
        },
        ReactNativeSafeAreaContext: () => {
            return ReactNativeSafeAreaContext
        },
        ReactNavigation: () => {
            return ReactNavigation
        },
        Shopify: () => {
            return Shopify
        },
        Zustand: () => {
            return Zustand
        },
    },
)
