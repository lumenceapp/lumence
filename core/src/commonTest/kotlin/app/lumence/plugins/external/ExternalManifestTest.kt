package app.lumence.plugins.external

import app.lumence.plugins.API_DEPENDENCY_ID
import app.lumence.plugins.DISCORD_DEPENDENCY_ID
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNull

private fun manifest(
    id: String = "a.b",
    format: Int = MANIFEST_FORMAT,
    icon: String? = null,
    dependencies: Map<String, ExternalDependency> = mapOf(
        API_DEPENDENCY_ID to ExternalDependency("*"),
        DISCORD_DEPENDENCY_ID to ExternalDependency("*"),
    ),
) = ExternalManifest(
    format = format,
    id = id,
    name = "A",
    icon = icon,
    version = "1.0.0",
    dependencies = dependencies,
)

class ExternalManifestTest {
    @Test
    fun `only the current manifest format is accepted`() {
        manifest().validate()

        assertFailsWith<IllegalArgumentException> { manifest(format = MANIFEST_FORMAT + 1).validate() }
    }

    @Test
    fun `the reserved dependencies are mandatory and never optional`() {
        assertFailsWith<IllegalArgumentException> {
            manifest(dependencies = mapOf(API_DEPENDENCY_ID to ExternalDependency("*"))).validate()
        }
        assertFailsWith<IllegalArgumentException> {
            manifest(
                dependencies = mapOf(
                    API_DEPENDENCY_ID to ExternalDependency("*", optional = true),
                    DISCORD_DEPENDENCY_ID to ExternalDependency("*"),
                ),
            ).validate()
        }
    }

    @Test
    fun `the older api dependency id maps to the current one`() {
        val parsed = manifest(
            dependencies = mapOf(
                "valenced.api" to ExternalDependency(">=1 <2"),
                "valenced.api.themes" to ExternalDependency("*"),
                DISCORD_DEPENDENCY_ID to ExternalDependency("*"),
            ),
        )
        parsed.validate()
        val deps = parsed.toPluginManifest().dependencies
        assertEquals(
            setOf(API_DEPENDENCY_ID, "lumence.api.themes", DISCORD_DEPENDENCY_ID),
            deps.keys,
        )
        assertEquals(">=1 <2", deps.getValue(API_DEPENDENCY_ID).version.toString())
    }

    @Test
    fun `plugin ids can't traverse a path`() {
        for (id in listOf("../evil", ".hidden", "a..b", "a/b")) {
            assertFailsWith<IllegalArgumentException>("expected '$id' to be rejected") { manifest(id = id).validate() }
        }
    }

    @Test
    fun `icons are asset names or data urls, never fetchable`() {
        assertEquals("ic_asset", manifest(icon = "ic_asset").toPluginManifest().icon)
        assertEquals("data:image/png;base64,AA", manifest(icon = "data:image/png;base64,AA").toPluginManifest().icon)
        assertNull(manifest(icon = "https://example.test/icon.png").toPluginManifest().icon)
        assertNull(manifest(icon = "data:image/png;base64," + "A".repeat(128 * 1024)).toPluginManifest().icon)
    }
}
