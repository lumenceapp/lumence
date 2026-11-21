import { lookupModule } from '@lumence/modules/finders'
import { withDependencies, withProps } from '@lumence/modules/finders/filters'
import { proxify } from '@lumence/utils/proxy'

const { partial, relative } = withDependencies

export let BottomSheet: typeof import('@gorhom/bottom-sheet') = proxify(
    () => {
        const [module] = lookupModule(
            withProps<typeof BottomSheet>(
                'BottomSheetModal',
                'BottomSheetScrollView',
            )
                // [constants, ...]
                .and(withDependencies(partial([relative(1), relative(2)])))
                .keyAs('lumence.externals.Gorhom.BottomSheet'),
        )

        if (module) return (BottomSheet = module)
    },
    {
        hint: {},
    },
)!
