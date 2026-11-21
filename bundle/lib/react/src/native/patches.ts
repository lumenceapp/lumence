import { instead } from '@lumence/patcher'
import { ReactNative } from '..'
import {
    sAfterRunApplication,
    sBeforeRunApplication,
    setLastRunApplicationArgs,
} from './_internal'

instead(ReactNative.AppRegistry, 'runApplication', function (args, orig) {
    setLastRunApplicationArgs(args)

    for (const cb of sBeforeRunApplication)
        try {
            cb(args)
        } catch {}

    Reflect.apply(orig, this, args)

    for (const cb of sAfterRunApplication)
        try {
            cb(args)
        } catch {}
})
