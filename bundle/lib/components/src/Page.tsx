import { Design } from '@lumence/discord/design'
import { PageSpacing, styles } from './_internal'
import type { DiscordModules } from '@lumence/discord/types'

export default function Page(props: DiscordModules.Components.StackProps) {
    return (
        <Design.Stack
            spacing={PageSpacing}
            style={[styles.grow, styles.pagePadding]}
            {...props}
        >
            {props.children}
        </Design.Stack>
    )
}
