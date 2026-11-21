import { Logger } from '@lumence/discord/common/logger'
import { before } from '@lumence/patcher'
import type { LogEntry } from './types'

type NativeLoggingHook = (message: string, level: number) => void

const maxLogs = 500
const logs: LogEntry[] = []
const listeners = new Set<() => void>()
const loggerMethods = [
    ['log', 1],
    ['warn', 2],
    ['error', 3],
    ['info', 1],
    ['trace', 1],
    ['verbose', 0],
] as const

let captureEnabled = false
let nativeHook: NativeLoggingHook | undefined
let originalNativeHook: NativeLoggingHook | undefined
let loggerUnpatches: Array<() => void> = []

export function getLogs() {
    return [...logs]
}

export function clearLogs() {
    logs.length = 0
    notify()
}

export function subscribeLogs(listener: () => void) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

export function setLogCaptureEnabled(enabled: boolean) {
    if (enabled === captureEnabled) return
    captureEnabled = enabled

    if (enabled) installCapture()
    else uninstallCapture()
}

function installCapture() {
    installNativeHook()
    installLoggerPatches()
}

function uninstallCapture() {
    uninstallNativeHook()

    for (const unpatch of loggerUnpatches) unpatch()
    loggerUnpatches = []
}

function installNativeHook() {
    const target = globalThis as typeof globalThis & {
        nativeLoggingHook: NativeLoggingHook
    }
    originalNativeHook = target.nativeLoggingHook

    nativeHook = (message, level) => {
        addLog(level, message)
        originalNativeHook?.(message, level)
    }

    try {
        target.nativeLoggingHook = nativeHook
    } catch {}
}

function uninstallNativeHook() {
    const target = globalThis as typeof globalThis & {
        nativeLoggingHook: NativeLoggingHook
    }

    if (nativeHook && target.nativeLoggingHook === nativeHook)
        target.nativeLoggingHook = originalNativeHook ?? nativeHook

    nativeHook = undefined
    originalNativeHook = undefined
}

function installLoggerPatches() {
    for (const [method, level] of loggerMethods) {
        try {
            loggerUnpatches.push(
                before(Logger.prototype, method, args => {
                    addLog(level, formatArgs(args))
                    return args
                }),
            )
        } catch {}
    }
}

function addLog(level: number, message: string) {
    logs.push({ level, message, time: Date.now() })

    if (logs.length > maxLogs) logs.splice(0, logs.length - maxLogs)
    notify()
}

function notify() {
    for (const listener of [...listeners]) listener()
}

function formatArgs(args: readonly unknown[]) {
    return args.map(formatValue).join(' ')
}

function formatValue(value: unknown): string {
    if (typeof value === 'string') return value
    if (value instanceof Error) return `${value.name}: ${value.message}`

    try {
        return JSON.stringify(value) ?? String(value)
    } catch {
        return String(value)
    }
}
