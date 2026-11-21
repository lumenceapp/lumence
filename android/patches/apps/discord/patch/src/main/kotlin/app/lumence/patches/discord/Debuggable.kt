// SPDX-FileCopyrightText: 2026 Lumence
// SPDX-License-Identifier: AGPL-3.0-or-later

package app.lumence.patches.discord

import app.reseam.patch.patch

val enableDebugging = patch(LumenceStrings.enableDebugging) {
    description(LumenceStrings.enableDebuggingDescription)
    compatibleWith(DISCORD)
    enabledByDefault(false)

    execute {
        manifest.edit { findByTag("application").single()["android:debuggable"] = "true" }
    }
}
