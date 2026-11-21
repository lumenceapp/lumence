import * as PluginApiReact_ from '@lumence/react'
import * as PluginApiReactJsxRuntime from '@lumence/react/jsx-runtime'
import * as PluginApiReactNative from '@lumence/react/native'
import { spreadDescriptors } from '.'

export type PluginApiReact = typeof PluginApiReact_ & {
    jsxRuntime: typeof PluginApiReactJsxRuntime
    native: typeof PluginApiReactNative
}

export const react: PluginApiReact = spreadDescriptors(PluginApiReact_, {
    jsxRuntime: PluginApiReactJsxRuntime,
    native: PluginApiReactNative,
})
