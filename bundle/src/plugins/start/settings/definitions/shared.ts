import { ToastActionCreators } from '@lumence/discord/actions'
import { Clipboard } from '@lumence/externals/react-native-clipboard'
import { ReactNative } from '@lumence/react'
import { lookupGeneratedIconComponent } from '@lumence/utils/discord'
import type { SettingsItem } from '@lumence/discord/modules/settings'

const CopyIcon = lookupGeneratedIconComponent('CopyIcon')

export const CopyableSetting = (
    item: Omit<SettingsItem, 'type' | 'onClick'>,
    description: () => string,
): SettingsItem => ({
    ...item,
    useDescription: item.useDescription ?? (() => description()),
    type: 'pressable',
    onPress() {
        Clipboard.setString(description())
        ToastActionCreators.open('LUMENCE_SETTING_COPIED', {
            text: 'Copied to clipboard',
            icon: CopyIcon,
        })
    },
})

export const getRNVersion = () => {
    const { major, minor, patch, prerelease } =
        ReactNative.Platform.constants.reactNativeVersion
    return `${major}.${minor}.${patch}${prerelease ? `-${prerelease}` : ''}`
}
