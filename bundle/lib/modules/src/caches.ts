import {
    callNativeMethod,
    callNativeMethodSync,
} from '@lumence/modules/native'
import { debounce } from '@lumence/utils/callback'
import type { Metro } from '@lumence/modules/types'
import type { FilterResultFlag } from './finders/_internal'
import type { Filter } from './finders/filters'

const ExpectedCacheVersion = 3

export const Uncached: Cache = {
    blacklist: [],
    finds: {},
    version: ExpectedCacheVersion,
}

// In-memory cache
export let cache: Cache =
    callNativeMethodSync('lumence.caches.modules.read', []) ?? Uncached

if (cache.version !== ExpectedCacheVersion) {
    Uncached.outdated = true
    cache = Uncached
}

export type Blacklist = Metro.ModuleID[]
export type Finds = Record<
    Filter['key'],
    Record<Metro.ModuleID, FilterResultFlag> | null
>

export interface Cache {
    blacklist: Blacklist
    finds: Finds
    version: number
    // Indicates if the loader cache on an outdated format
    outdated?: boolean
}

const save = debounce(() => {
    callNativeMethod('lumence.caches.modules.write', [
        cache.blacklist,
        cache.finds,
    ])
}, 1000)

export function cacheBlacklistedModule(id: Metro.ModuleID): boolean {
    cache.blacklist.push(id)
    save()

    return true
}

export function cacheFilterResultForId(
    key: keyof Finds,
    id: Metro.ModuleID,
    flag: FilterResultFlag,
): FilterResultFlag {
    const reg = (cache.finds[key] ??= {})
    reg[id] = flag

    save()

    return flag
}

export function cacheFilterNotFound(key: keyof Finds) {
    cache.finds[key] = null
}

export const getFilterMatches = (
    key: keyof Finds,
): Finds[keyof Finds] | undefined => cache.finds[key]

export const getBlacklistedModules = () => cache.blacklist

declare module '@lumence/modules/native' {
    interface NativeMethods {
        'lumence.caches.modules.read': [[], Cache | null]
        'lumence.caches.modules.write': [
            [blacklist: Blacklist, finds: Finds],
            void,
        ]
    }
}
