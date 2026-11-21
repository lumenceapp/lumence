import type { RouteNames } from './constants'

declare module '@lumence/externals/react-navigation' {
    interface ReactNavigationParamList extends LumenceFeaturesParamList {}
}

type LumenceFeaturesParamList = {
    [K in (typeof RouteNames)[keyof typeof RouteNames]]: object
}

export interface PerfStats {
    fps: number
    frameTime: number
    droppedFrames: number
    heap?: string
}

export interface LogEntry {
    level: number
    message: string
    time: number
}

export interface MessageCreatePayload {
    message?: {
        id?: string
        content?: string
        attachments?: unknown[]
        author?: {
            username?: string
            globalName?: string
        }
    }
}
