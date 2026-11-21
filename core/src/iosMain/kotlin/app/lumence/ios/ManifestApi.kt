@file:OptIn(kotlin.experimental.ExperimentalNativeApi::class, kotlinx.cinterop.ExperimentalForeignApi::class)

package app.lumence.ios

import app.lumence.core.LumenceJson
import app.lumence.plugins.external.ExternalManifest
import app.lumence.plugins.external.validate
import kotlinx.cinterop.ByteVar
import kotlinx.cinterop.CPointer
import kotlinx.cinterop.CPointerVarOf
import kotlinx.cinterop.toKString
import kotlinx.serialization.Serializable

@CName("LumenceCore_ManifestParse")
fun manifestParse(
    json: CPointer<ByteVar>?,
    errorOut: CPointer<CPointerVarOf<CPointer<ByteVar>>>?,
): CPointer<ByteVar>? = guard(errorOut) {
    val parsed = LumenceJson.decodeFromString<ExternalManifest>(json?.toKString() ?: error("missing manifest JSON"))
    parsed.validate()
    val manifest = parsed.toPluginManifest()
    LumenceJson.encodeToString(
        NormalizedManifest.serializer(),
        NormalizedManifest(
            format = parsed.format,
            id = manifest.id,
            name = manifest.name,
            description = manifest.description,
            author = manifest.author,
            contributors = manifest.contributors,
            icon = manifest.icon,
            version = manifest.version.toString(),
            dependencies = manifest.dependencies.mapValues { (_, dep) ->
                NormalizedDependency(version = dep.version.toString(), optional = dep.optional)
            },
            dist = parsed.dist?.script?.takeIf { it.isNotEmpty() }?.let { NormalizedDist(script = it) },
        ),
    )
}

@Serializable
internal data class NormalizedDependency(val version: String, val optional: Boolean)

@Serializable
internal data class NormalizedDist(val script: String? = null)

@Serializable
internal data class NormalizedManifest(
    val format: Int,
    val id: String,
    val name: String,
    val description: String,
    val author: String,
    val contributors: List<String> = emptyList(),
    val icon: String? = null,
    val version: String,
    val dependencies: Map<String, NormalizedDependency> = emptyMap(),
    val dist: NormalizedDist? = null,
)
