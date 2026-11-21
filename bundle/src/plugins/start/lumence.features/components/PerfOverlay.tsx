import { StyleSheet, Text, View } from 'react-native'
import { usePerfStats } from '../perf'

export default function PerfOverlay() {
    const stats = usePerfStats()

    return (
        <View pointerEvents="none" style={styles.overlay}>
            <Text style={styles.line}>
                {`FPS ${stats.fps} | ${stats.frameTime} ms`}
            </Text>
            <Text style={styles.line}>{`Dropped ${stats.droppedFrames}`}</Text>
            {stats.heap ? <Text style={styles.line}>{stats.heap}</Text> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 48,
        right: 8,
        zIndex: 1000,
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
    line: {
        color: '#FFFFFF',
        fontSize: 12,
        fontFamily: 'monospace',
    },
})
