import {
    callNativeMethod,
    callNativeMethodSync,
} from '@lumence/modules/native'

export function readFile(path: string) {
    return callNativeMethod('lumence.fs.read', [path])
}

export function writeFile(path: string, data: string) {
    return callNativeMethod('lumence.fs.write', [path, data])
}

export function exists(path: string) {
    return callNativeMethod('lumence.fs.exists', [path])
}

export function rm(path: string) {
    return callNativeMethod('lumence.fs.delete', [path])
}

export function existsSync(path: string) {
    return callNativeMethodSync('lumence.fs.exists', [path])
}

export function readFileSync(path: string) {
    return callNativeMethodSync('lumence.fs.read', [path])
}

export function writeFileSync(path: string, data: string) {
    return callNativeMethodSync('lumence.fs.write', [path, data])
}

export function rmSync(path: string) {
    return callNativeMethodSync('lumence.fs.delete', [path])
}

export function deleteFileSync(path: string) {
    return callNativeMethodSync('lumence.fs.delete', [path])
}

export function getConstants() {
    return callNativeMethodSync('lumence.fs.getConstants', [])
}

declare module '@lumence/modules/native' {
    export interface NativeMethods {
        'lumence.fs.getConstants': [
            [],
            {
                data: string
                files: string
                cache: string
            },
        ]
        'lumence.fs.read': [[path: string], string]
        'lumence.fs.write': [[path: string, data: string], void]
        'lumence.fs.exists': [[path: string], boolean]
        'lumence.fs.delete': [[path: string], boolean]
    }
}
