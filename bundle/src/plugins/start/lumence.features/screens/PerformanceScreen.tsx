import { styles } from '@lumence/components/_'
import Page from '@lumence/components/Page'
import { Design } from '@lumence/discord/design'
import { useCallback } from 'react'
import { ScrollView } from 'react-native'
import { resetPerfStats, usePerfStats } from '../perf'

const { Button, Stack, TableRow, TableRowGroup } = Design

export default function PerformanceScreen() {
    const stats = usePerfStats()
    const reset = useCallback(() => resetPerfStats(), [])

    return (
        <Page spacing={0}>
            <ScrollView style={styles.flex}>
                <Stack spacing={16} style={{ paddingBottom: 32 }}>
                    <TableRowGroup title="Frame stats">
                        <TableRow label="FPS" subLabel={`${stats.fps}`} />
                        <TableRow
                            label="Frame time"
                            subLabel={`${stats.frameTime} ms`}
                        />
                        <TableRow
                            label="Dropped frames"
                            subLabel={`${stats.droppedFrames}`}
                        />
                        <TableRow
                            label="Hermes heap"
                            subLabel={stats.heap ?? 'Unavailable'}
                        />
                    </TableRowGroup>
                    <Button
                        text="Reset stats"
                        variant="secondary"
                        onPress={reset}
                    />
                </Stack>
            </ScrollView>
        </Page>
    )
}
