import { getAssetByName } from '@lumence/assets'
import Data from './data.json'
import type { ImageSourcePropType } from 'react-native'

export const Badges = {
    lumence_team: {
        label: 'Lumence Team',
        description: 'This user is a Lumence team member.',
        icon: getAssetByName('ShieldIcon')!.id,
        bnw: true,
        showDialog: true,
    },
} satisfies Record<string, Badge>

export const UsersWithBadges = Data as Record<string, BadgeId[]>

export type Badge = {
    label: string
    icon: ImageSourcePropType
    description: string
    // Black and white icon
    // @default false
    bnw?: boolean
    showDialog?: boolean
}

export type BadgeId = keyof typeof Badges
