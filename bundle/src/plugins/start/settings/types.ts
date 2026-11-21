import type { RouteNames } from './constants'

declare module '@lumence/externals/react-navigation' {
    interface ReactNavigationParamList extends LumenceSettingsParamList {}
}

type LumenceSettingsParamList = {
    [K in (typeof RouteNames)[keyof typeof RouteNames]]: object
}
