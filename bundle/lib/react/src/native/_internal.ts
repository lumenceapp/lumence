import type { RunApplicationCallback } from '@lumence/react/types'

export const sBeforeRunApplication = new Set<RunApplicationCallback>()
export const sAfterRunApplication = new Set<RunApplicationCallback>()

let lastRunApplicationArgs: unknown[] = []

export function getLastRunApplicationArgs() {
    return lastRunApplicationArgs
}

export function setLastRunApplicationArgs(args: unknown[]) {
    lastRunApplicationArgs = args
}
