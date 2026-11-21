import { styles } from '@lumence/components/_'
import Page from '@lumence/components/Page'
import { Design } from '@lumence/discord/design'
import { Clipboard } from '@lumence/externals/react-native-clipboard'
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { clearLogs, getLogs, subscribeLogs } from '../logs'
import type { LogEntry } from '../types'

const { Button, Card, Stack, Text } = Design

export default function DebugLogsScreen() {
    const [logs, setLogs] = useState(getLogs)

    useEffect(() => subscribeLogs(() => setLogs(getLogs())), [])

    const copy = useCallback(() => {
        Clipboard.setString(formatLogs(logs))
    }, [logs])

    const clear = useCallback(() => {
        clearLogs()
        setLogs(getLogs())
    }, [])

    return (
        <Page spacing={16}>
            <Stack direction="horizontal" spacing={8}>
                <Button
                    grow
                    text="Copy logs"
                    disabled={!logs.length}
                    onPress={copy}
                />
                <Button
                    grow
                    text="Clear"
                    variant="secondary"
                    disabled={!logs.length}
                    onPress={clear}
                />
            </Stack>
            <ScrollView style={styles.flex}>
                <Card style={{ padding: 12 }}>
                    <Text selectable style={logStyles.content}>
                        {logs.length ? formatLogs(logs) : 'No logs captured.'}
                    </Text>
                </Card>
            </ScrollView>
        </Page>
    )
}

function formatLogs(logs: LogEntry[]) {
    return logs.map(formatLog).join('\n')
}

function formatLog(entry: LogEntry) {
    const time = new Date(entry.time).toLocaleTimeString()
    return `[${time}] ${levelName(entry.level)} ${entry.message}`
}

function levelName(level: number) {
    if (level >= 3) return 'ERROR'
    if (level === 2) return 'WARN'
    return 'INFO'
}

const logStyles = StyleSheet.create({
    content: {
        fontFamily: 'monospace',
        fontSize: 12,
    },
})
