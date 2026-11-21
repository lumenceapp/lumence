export const Setting = {
    LumencePlugins: 'LumencePlugins',
    LumencePluginsAdvanced: 'LumencePluginsAdvanced',
    LumencePluginsBrowse: 'LumencePluginsBrowse',
    LumencePluginsUpdates: 'LumencePluginsUpdates',
} as const

export const RouteNames = {
    [Setting.LumencePlugins]: 'Lumence Plugins',
    [Setting.LumencePluginsAdvanced]: 'Lumence Plugins Advanced',
    [Setting.LumencePluginsBrowse]: 'Browse Plugins',
    [Setting.LumencePluginsUpdates]: 'Plugin Updates',
} as const
