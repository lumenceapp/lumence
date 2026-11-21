package app.lumence.xposed.tweaks.bridge

import app.lumence.bridge.asDelegate
import app.lumence.reloadApp
import app.lumence.xposed.api.registerNativeMethod
import app.lumence.xposed.openFileGuarded
import app.lumence.xposed.tweak
import java.io.File

// `lumence.fs.*` + `lumence.app.*` bridge methods.
val additionalBridgeMethods by tweak {
    registerNativeMethod("lumence.app.reload") {
        reloadApp()
    }

    withAppContext { ctx ->
        registerNativeMethod("lumence.fs.getConstants") {
            mapOf(
                "data" to ctx.dataDir.absolutePath,
                "files" to ctx.filesDir.absolutePath,
                "cache" to ctx.cacheDir.absolutePath,
            )
        }

        registerNativeMethod("lumence.fs.delete") { args ->
            val argv = args.asDelegate()
            val path by argv.string()
            val f = File(path)
            if (f.isDirectory) f.deleteRecursively() else f.delete()
        }

        registerNativeMethod("lumence.fs.exists") { args ->
            val argv = args.asDelegate()
            val path by argv.string()
            File(path).exists()
        }

        registerNativeMethod("lumence.fs.read") { args ->
            val argv = args.asDelegate()
            val path by argv.string()
            val file = File(path).also { it.openFileGuarded() }
            file.bufferedReader().use { it.readText() }
        }

        registerNativeMethod("lumence.fs.write") { args ->
            val argv = args.asDelegate()
            val path by argv.string()
            val contents by argv.string()
            File(path).apply {
                if (isDirectory) throw Error("Path is a directory: $path")
                parentFile?.mkdirs()
                writeText(contents)
            }

            null
        }
    }
}
