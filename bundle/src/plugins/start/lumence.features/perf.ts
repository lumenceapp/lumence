import { ReactNative } from '@lumence/react'
import {
    getLastRunApplicationArgs,
    onRunApplicationFinished,
} from '@lumence/react/native'
import { useEffect, useState } from 'react'
import { PerfOverlayAppKey } from './constants'
import type { ComponentType } from 'react'
import type { PerfStats } from './types'

const initialStats: PerfStats = {
    fps: 0,
    frameTime: 0,
    droppedFrames: 0,
}
const frameWindowMs = 500
const slowFrameMs = 34

const listeners = new Set<() => void>()
let stats = initialStats
let tracking = false
let frameHandle = 0
let frameCount = 0
let frameTotal = 0
let droppedFrames = 0
let lastFrameTime = 0
let overlayEnabled = false
let overlayRootTag: number | undefined
let overlayMounted = false
let overlayComponent: ComponentType | undefined
let componentRegistered = false
let unwatchRunApplication: (() => void) | undefined

export function getPerfStats() {
    return stats
}

export function resetPerfStats() {
    stats = { ...initialStats }
    frameCount = 0
    frameTotal = 0
    droppedFrames = 0
    notify()
}

export function subscribePerfStats(listener: () => void) {
    listeners.add(listener)
    startTracking()

    return () => {
        listeners.delete(listener)
        if (!listeners.size) stopTracking()
    }
}

export function usePerfStats() {
    const [value, setValue] = useState(getPerfStats)

    useEffect(() => subscribePerfStats(() => setValue(getPerfStats())), [])

    return value
}

export function setPerfOverlayComponent(component: ComponentType) {
    overlayComponent = component
}

export function setPerfOverlayEnabled(enabled: boolean) {
    if (enabled === overlayEnabled) {
        if (enabled) mountOverlay()
        return
    }

    overlayEnabled = enabled

    if (enabled) {
        watchRunApplication()
        mountOverlay()
    } else unmountOverlay()
}

export function disposePerfOverlay() {
    setPerfOverlayEnabled(false)
    unwatchRunApplication?.()
    unwatchRunApplication = undefined
}

function watchRunApplication() {
    if (unwatchRunApplication) return

    unwatchRunApplication = onRunApplicationFinished(() => {
        if (overlayEnabled) mountOverlay()
    })
}

function mountOverlay() {
    if (!overlayEnabled || overlayMounted) return

    const rootTag = getRootTag()
    if (rootTag === undefined) return

    ensureOverlayComponent()
    overlayRootTag = rootTag
    overlayMounted = true

    try {
        ReactNative.AppRegistry.runApplication(PerfOverlayAppKey, {
            initialProps: {},
            rootTag,
        })
    } catch {
        overlayMounted = false
        overlayRootTag = undefined
    }
}

function unmountOverlay() {
    if (!overlayMounted || overlayRootTag === undefined) return

    ReactNative.AppRegistry.unmountApplicationComponentAtRootTag(overlayRootTag)
    overlayMounted = false
    overlayRootTag = undefined
}

function ensureOverlayComponent() {
    if (componentRegistered || !overlayComponent) return

    ReactNative.AppRegistry.registerComponent(
        PerfOverlayAppKey,
        () => overlayComponent!,
    )
    componentRegistered = true
}

function getRootTag() {
    const params = getLastRunApplicationArgs()[1] as
        | { rootTag?: unknown }
        | undefined

    return typeof params?.rootTag === 'number' ? params.rootTag : undefined
}

function startTracking() {
    if (tracking) return

    tracking = true
    lastFrameTime = performance.now()
    frameHandle = requestAnimationFrame(onFrame)
}

function stopTracking() {
    if (!tracking) return

    tracking = false
    cancelAnimationFrame(frameHandle)
}

function onFrame(now: number) {
    if (!tracking) return

    const delta = now - lastFrameTime
    lastFrameTime = now
    frameCount++
    frameTotal += delta

    if (delta > slowFrameMs) droppedFrames++

    if (frameTotal >= frameWindowMs) {
        stats = {
            fps: Math.round((frameCount * 1000) / frameTotal),
            frameTime: Math.round((frameTotal / frameCount) * 10) / 10,
            droppedFrames,
            heap: readHeap(),
        }

        frameCount = 0
        frameTotal = 0
        droppedFrames = 0
        notify()
    }

    frameHandle = requestAnimationFrame(onFrame)
}

function notify() {
    for (const listener of [...listeners]) listener()
}

function readHeap(): string | undefined {
    const hermes = HermesInternal as unknown as Record<string, unknown>
    const getHeapInfo = hermes.getHeapInfo

    if (typeof getHeapInfo === 'function') {
        try {
            const info = getHeapInfo.call(HermesInternal) as Record<
                string,
                unknown
            >
            const used = firstNumber(info, ['heapUsed', 'used', 'usedSize'])
            const total = firstNumber(info, ['heapSize', 'size', 'total'])

            if (used !== undefined && total !== undefined)
                return `${formatBytes(used)} / ${formatBytes(total)}`
        } catch {}
    }

    const properties = HermesInternal.getRuntimeProperties()
    const key = Object.keys(properties).find(name =>
        name.toLowerCase().includes('heap'),
    )

    return key ? `${key}: ${properties[key]}` : undefined
}

function firstNumber(source: Record<string, unknown>, keys: string[]) {
    for (const key of keys)
        if (typeof source[key] === 'number') return source[key] as number
}

function formatBytes(value: number) {
    if (value < 1024) return `${value} B`
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
    return `${(value / 1024 / 1024).toFixed(1)} MB`
}
