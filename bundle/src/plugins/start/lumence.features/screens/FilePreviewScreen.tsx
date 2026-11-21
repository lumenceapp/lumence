import { styles } from '@lumence/components/_'
import Page from '@lumence/components/Page'
import { Design } from '@lumence/discord/design'
import { FileModule } from '@lumence/discord/native'
import { Clipboard } from '@lumence/externals/react-native-clipboard'
import { useCallback, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

const { Button, Card, Stack, Text, TextInput } = Design
const maxPreviewChars = 100_000

export default function FilePreviewScreen() {
    const [path, setPath] = useState(
        () => FileModule.getConstants().DocumentsDirPath || '',
    )
    const [contents, setContents] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const read = useCallback(async () => {
        const target = path.trim()
        if (!target) return

        setLoading(true)
        setError('')
        setContents('')

        try {
            const normalized = target.startsWith('file://')
                ? target.slice(7)
                : target

            if (!(await FileModule.fileExists(normalized)))
                throw new Error('File not found')

            const raw = await FileModule.readFile(normalized, 'utf8')
            if (raw.includes('\0')) throw new Error('Binary file')

            setContents(
                raw.length > maxPreviewChars
                    ? `${raw.slice(0, maxPreviewChars)}\n\nPreview truncated`
                    : raw,
            )
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e))
        } finally {
            setLoading(false)
        }
    }, [path])

    const copy = useCallback(() => {
        if (contents) Clipboard.setString(contents)
    }, [contents])

    return (
        <Page spacing={16}>
            <TextInput
                label="File path"
                onChange={setPath}
                placeholder="/data/data/com.discord/files/example.txt"
                size="md"
                value={path}
            />
            <Stack direction="horizontal" spacing={8}>
                <Button
                    grow
                    text="Read file"
                    loading={loading}
                    disabled={!path.trim()}
                    onPress={read}
                />
                <Button
                    grow
                    text="Copy"
                    variant="secondary"
                    disabled={!contents}
                    onPress={copy}
                />
            </Stack>
            {error ? <Text color="text-feedback-critical">{error}</Text> : null}
            <ScrollView style={styles.flex}>
                <Card style={{ padding: 12 }}>
                    <View>
                        <Text selectable style={fileStyles.content}>
                            {contents || 'No file contents loaded.'}
                        </Text>
                    </View>
                </Card>
            </ScrollView>
        </Page>
    )
}

const fileStyles = StyleSheet.create({
    content: {
        fontFamily: 'monospace',
        fontSize: 12,
    },
})
