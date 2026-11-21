import { lookupModule } from '@lumence/modules/finders'
import { withDependencies, withProps } from '@lumence/modules/finders/filters'
import { ReactNativeModuleId } from '@lumence/react'
import { proxify } from '@lumence/utils/proxy'

const { partial, relative } = withDependencies

export let FlashList: typeof import('@shopify/flash-list') = proxify(
    () => {
        const [module] = lookupModule(
            withProps<typeof FlashList>('FlashList')
                .and(
                    // [isNewArch, ErrorMessages, FlashList, ...]
                    withDependencies(
                        partial([
                            // isNewArch: [ReactNative]
                            relative.withDependencies([ReactNativeModuleId], 1),
                            relative(2),
                            // FlashList: [RecyclerView]
                            relative.withDependencies([relative(1)], 3),
                        ]),
                    ),
                )
                .keyAs('lumence.externals.Shopify.FlashList'),
        )

        if (module) return (FlashList = module)
    },
    {
        hint: {},
    },
)!
