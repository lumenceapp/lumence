import { getAssetIdByName } from '@lumence/assets'
import { styles } from '@lumence/components/_'
import { Design } from '@lumence/discord/design'
import { SettingListRenderer } from '@lumence/discord/modules/settings/renderer'
import { Linking, ScrollView, StyleSheet, View } from 'react-native'
import { Setting } from '../constants'

const { Button, Card, Stack, Text } = Design

export default function LumenceSettingScreen() {
    return (
        <ScrollView style={{ flex: 1 }}>
            <Stack spacing={0}>
                <View style={{ padding: 16, paddingBottom: 0 }}>
                    <DonateCard />
                </View>
                <View>
                    <SettingListRenderer.SettingsList
                        node={{
                            type: 'list',
                            sections: [
                                {
                                    label: 'Lumence',
                                    settings: [
                                        Setting.LumenceVersion,
                                        Setting.LoaderVersion,
                                        Setting.LumenceSourceRepository,
                                        Setting.LumenceLicense,
                                    ],
                                },
                                {
                                    label: 'Versions',
                                    settings: [
                                        Setting.ReactVersion,
                                        Setting.ReactNativeVersion,
                                        Setting.HermesVersion,
                                    ],
                                },
                                {
                                    label: 'Actions',
                                    settings: [
                                        Setting.Reload,
                                        Setting.LumenceEnterRecoveryMode,
                                    ],
                                },
                                {
                                    label: 'Developer',
                                    settings: [Setting.LumenceDeveloperMode],
                                },
                            ],
                        }}
                    />
                </View>
            </Stack>
        </ScrollView>
    )
}

const cardStyles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },
})

function DonateCard() {
    return (
        <Card
            style={{
                position: 'relative',
                padding: 0,
                overflow: 'hidden',
            }}
        >
            <View
                style={[
                    cardStyles.background,
                    {
                        opacity: 0.5,
                        experimental_backgroundImage:
                            'linear-gradient(166deg, rgba(29, 146, 255, 0.33), rgba(62, 47, 145, 0)), ' +
                            'linear-gradient(45deg, rgba(47, 125, 145, 0),rgba(65, 22, 255, 0.5)))',
                    },
                ]}
            />
            <View style={{ padding: 16 }}>
                <Stack style={styles.grow} direction="horizontal" spacing={16}>
                    <Stack spacing={16} style={styles.flex}>
                        <Stack spacing={6} style={styles.flex}>
                            <Text
                                variant="heading-lg/semibold"
                                color="text-strong"
                            >
                                Support Lumence
                            </Text>
                            <Text variant="text-md/medium">
                                You can help improve Lumence by contributing on
                                GitHub.
                            </Text>
                        </Stack>
                        <Stack spacing={12} direction="horizontal">
                            <Button
                                size="sm"
                                icon={getAssetIdByName('HandRequestSpeakIcon')}
                                text="Contribute"
                                variant="primary-overlay"
                                onPress={() => {
                                    Linking.openURL(
                                        __BUILD_SOURCE_REPOSITORY_URL__,
                                    )
                                }}
                            />
                        </Stack>
                    </Stack>
                </Stack>
            </View>
        </Card>
    )
}
