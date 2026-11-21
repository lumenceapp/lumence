// SPDX-FileCopyrightText: 2026 Lumence
// SPDX-License-Identifier: AGPL-3.0-or-later

package app.lumence.patches.discord

import app.reseam.patch.patch

val changeAppName = patch(LumenceStrings.changeAppName) {
    description(LumenceStrings.changeAppNameDescription)
    compatibleWith(DISCORD)

    val appNameOption = stringOption(
        "appName",
        title = LumenceStrings.appName,
        description = LumenceStrings.appNameDescription,
        default = "Lumence",
    )

    execute {
        val name = options[appNameOption]
        manifest.edit {
            findByTag("application").single()["android:label"] = name
            // An activity's own label wins over the app's, and Discord's launcher activity has one.
            findByTag("activity").filter { it["android:label"] != null }.forEach { it["android:label"] = name }
        }
    }
}
