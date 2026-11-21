package app.lumence.xposed

object LumenceConstants {
    const val TARGET_PACKAGE = "com.discord"

    const val FILES_DIR = "files/lumence"
    const val CACHE_DIR = "cache/lumence"
    const val MAIN_SCRIPT_FILE = "bundle.js"
    const val BUNDLE_MANIFEST_FILE = "manifest.json"
    const val PRELOADS_DIR = "preloads"

    const val LOADER_NAME = "LumenceAndroid"
    val LOADER_VERSION
        get() = BuildConfig.VERSION_NAME
    val USER_AGENT
        get() = "LumenceAndroid/$LOADER_VERSION"

    // Hermes bundle shipped inside this APK's `assets/` directory, built by the `:bundle` project.
    // Loaded by [app.lumence.xposed.tweaks.lumenceScriptLoader].
    const val BUNDLE_ASSET = "assets://lumence.bundle"
}

// Hermes bytecode assets shipped inside the Xposed module APK.
val scriptAssets = emptyList<String>()
