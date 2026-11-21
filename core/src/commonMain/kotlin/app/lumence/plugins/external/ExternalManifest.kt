package app.lumence.plugins.external

import app.lumence.plugins.API_DEPENDENCY_ID
import app.lumence.plugins.LEGACY_API_DEPENDENCY_ID
import app.lumence.plugins.PluginDependency
import app.lumence.plugins.PluginManifest
import app.lumence.plugins.RESERVED_DEPENDENCY_IDS
import app.lumence.plugins.Version
import app.lumence.plugins.VersionRange
import app.lumence.plugins.normalizeDependencyId
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

const val MANIFEST_FILE = "manifest.json"

const val MANIFEST_FORMAT = 1

@Serializable
data class ExternalManifest(
    // Manifest format version. Only [MANIFEST_FORMAT] is accepted.
    val format: Int,
    val id: String,
    val name: String,
    val description: String = "",
    val author: String = "",
    val contributors: List<String> = emptyList(),
    // See [validatedPluginIcon].
    val icon: String? = null,
    // The plugin's version.
    val version: String,
    // Dependencies keyed by plugin ID: `{ "<id>": { "version"?: "<range>", "optional"?: true } }`.
    val dependencies: Map<String, ExternalDependency> = emptyMap(),
    val dist: ExternalDist? = null,
) {
    fun toPluginManifest() = PluginManifest(
        id = id,
        name = name,
        description = description,
        author = author,
        contributors = contributors,
        icon = icon?.let(::validatedPluginIcon),
        dependencies = dependencies.entries.associate { (depId, dep) ->
            val id = normalizeDependencyId(depId)
            requireValidPluginId(id)
            id to PluginDependency(
                version = dep.version?.let(VersionRange::parse) ?: VersionRange.ANY,
                optional = dep.optional,
            )
        },
        version = Version.parse(version),
    )
}

@Serializable
data class ExternalDependency(
    // Version range. `null` (empty object in JSON) means `"*"`.
    val version: String? = null,
    // Optional dependencies won't block the dependent.
    val optional: Boolean = false,
)

@Serializable
data class ExternalDist(
    val script: String? = null,
    val android: ExternalAndroidDist? = null,
)

@Serializable
data class ExternalAndroidDist(
    val path: String,
    @SerialName("class") val className: String,
)

// Longest accepted `data:` icon value.
private const val MAX_ICON_DATA_URL_LENGTH = 128 * 1024

private val URI_SCHEME_REGEX = Regex("^[A-Za-z][A-Za-z0-9+.-]*:")

// Icons are either a packaged asset name or a size-capped `data:` URL.
// Anything else is stripped. Icons are never fetched over the network.
fun validatedPluginIcon(icon: String): String? = when {
    icon.startsWith("data:") -> icon.takeIf { it.length <= MAX_ICON_DATA_URL_LENGTH }
    URI_SCHEME_REGEX.containsMatchIn(icon) -> null
    else -> icon
}

fun ExternalManifest.validate() {
    require(format == MANIFEST_FORMAT) {
        "Plugin '$id' has unsupported manifest format $format (supported: $MANIFEST_FORMAT)"
    }
    requireValidPluginId(id)
    Version.parse(version)

    require(!(API_DEPENDENCY_ID in dependencies && LEGACY_API_DEPENDENCY_ID in dependencies)) {
        "Plugin '$id' declares both API dependency ids"
    }
    val declaredIds = dependencies.keys.map(::normalizeDependencyId).toSet()
    for (reservedId in RESERVED_DEPENDENCY_IDS) {
        require(reservedId in declaredIds) {
            "Plugin '$id' does not declare the mandatory '$reservedId' dependency"
        }
    }
    for ((depId, dep) in dependencies) {
        val id = normalizeDependencyId(depId)
        requireValidPluginId(id)
        dep.version?.let(VersionRange::parse)
        require(!(dep.optional && id in RESERVED_DEPENDENCY_IDS)) {
            "Plugin '$id': the '$depId' dependency cannot be optional"
        }
    }
}

private val PLUGIN_ID_REGEX = Regex("[a-zA-Z0-9.-]+")

// Matches `[a-zA-Z0-9.-]`, with no consecutive dots or leading dot.
fun requireValidPluginId(id: String) {
    require(PLUGIN_ID_REGEX.matches(id) && ".." !in id && !id.startsWith(".")) {
        "Invalid plugin ID: $id"
    }
}
