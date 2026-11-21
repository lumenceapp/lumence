import { ToastActionCreators } from '@lumence/discord/actions'
import { onFluxEventDispatched } from '@lumence/discord/flux'
import { lookupGeneratedIconComponent } from '@lumence/utils/discord'
import type { MessageCreatePayload } from './types'

let unsubscribe: (() => void) | undefined

export function setMessageToastsEnabled(enabled: boolean) {
    if (enabled === Boolean(unsubscribe)) return

    if (!enabled) {
        unsubscribe?.()
        unsubscribe = undefined
        return
    }

    unsubscribe = onFluxEventDispatched<MessageCreatePayload>(
        'MESSAGE_CREATE',
        payload => {
            showToast(payload)
        },
    )
}

function showToast(payload: MessageCreatePayload) {
    const message = payload.message
    if (!message) return

    const content = message.content?.trim()
    const attachmentCount = Array.isArray(message.attachments)
        ? message.attachments.length
        : 0

    if (!content && !attachmentCount) return

    const author =
        message.author?.globalName || message.author?.username || 'Message'
    const preview =
        content ||
        `${attachmentCount} attachment${attachmentCount === 1 ? '' : 's'}`

    try {
        ToastActionCreators.open('LUMENCE_MESSAGE_TOAST', {
            text: `${author}: ${preview}`,
            icon: lookupGeneratedIconComponent('SendMessageIcon'),
            variant: 'success',
            duration: 4000,
        })
    } catch {}
}
