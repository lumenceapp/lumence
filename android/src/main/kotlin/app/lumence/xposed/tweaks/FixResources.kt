package app.lumence.xposed.tweaks

import android.content.res.Resources
import app.lumence.xposed.LumenceConstants
import app.lumence.xposed.hook
import app.lumence.xposed.method
import app.lumence.xposed.tweak

// Hooks [Resources.getIdentifier] to rewrite the package name to `com.discord` when the host app was repackaged.
val fixResources by tweak {
    val hostPkg = appInfo.packageName
    if (hostPkg == LumenceConstants.TARGET_PACKAGE) return@tweak

    Resources::class.java.method(
        "getIdentifier",
        String::class.java,
        String::class.java,
        String::class.java,
    ).hook {
        before {
            if (args[2] == hostPkg) args[2] = LumenceConstants.TARGET_PACKAGE
        }
    }
}
