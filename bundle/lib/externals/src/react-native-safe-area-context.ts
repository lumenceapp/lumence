import { lookupModule } from '@lumence/modules/finders'
import { withDependencies, withProps } from '@lumence/modules/finders/filters'
import {
    ReactJSXRuntimeModuleId,
    ReactModuleId,
    ReactNativeModuleId,
} from '@lumence/react'
import { proxify } from '@lumence/utils/proxy'

const { relative, partial } = withDependencies

const withSafeAreaContextModule = () =>
    withDependencies(
        // first dependency is next to this module, but we also need to check its dependencies
        // hence relative.withDependencies(firstDependencyDependencies, 1),
        partial([
            relative.withDependencies(
                [
                    null,
                    ReactModuleId,
                    ReactNativeModuleId,
                    ReactJSXRuntimeModuleId,
                    relative.withDependencies([relative(1)], 1),
                ],
                1,
            ),
        ]),
    )

export let ReactNativeSafeAreaContext: typeof import('react-native-safe-area-context') =
    proxify(
        () => {
            const [module] = lookupModule(
                withProps<typeof ReactNativeSafeAreaContext>('SafeAreaProvider')
                    .and(withSafeAreaContextModule())
                    .keyAs(
                        'lumence.externals.ReactNativeSafeAreaContext.ReactNativeSafeAreaContext',
                    ),
            )

            if (module) {
                return (ReactNativeSafeAreaContext = module)
            }
        },
        {
            hint: {},
        },
    )!
