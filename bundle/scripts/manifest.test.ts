import { mkdir, mkdtemp, writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'
import { beforeEach, describe, expect, it } from 'vitest'
import { getInternalPluginManifests } from './manifest'

let root: string

beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'lumence-manifests-'))
})

async function plugin(stage: string, dir: string, manifest: unknown) {
    const path = join(root, stage, dir)
    await mkdir(path, { recursive: true })
    await writeFile(join(path, 'manifest.json'), JSON.stringify(manifest))
}

describe('getInternalPluginManifests', () => {
    it('stamps every plugin with the bundle version', async () => {
        await plugin('preinit', 'api', { id: 'lumence.api' })
        await plugin('start', 'settings', { id: 'lumence.settings' })

        expect(await getInternalPluginManifests(root)).toEqual([
            { id: 'lumence.api' },
            { id: 'lumence.settings' },
        ])
    })

    it('keeps dependencies, which is the half native cannot derive', async () => {
        await plugin('start', 'settings', { id: 'lumence.settings' })
        await plugin('start', 'settings.plugins', {
            id: 'lumence.settings.plugins',
            dependencies: { 'lumence.settings': {} },
        })

        const plugins = await getInternalPluginManifests(root)
        expect(plugins).toContainEqual({
            id: 'lumence.settings.plugins',
            dependencies: { 'lumence.settings': {} },
        })
    })

    it('drops everything native does not read', async () => {
        await plugin('start', 'settings', {
            id: 'lumence.settings',
            name: 'Settings',
            description: 'Settings UI for Lumence.',
            author: 'Lumence',
            icon: 'SettingsIcon',
        })

        const plugins = await getInternalPluginManifests(root)
        expect(plugins).toEqual([{ id: 'lumence.settings' }])
    })

    // Replaces the type checking lost when cross-plugin ID imports were removed.
    it('rejects a dependency on a plugin that does not exist', async () => {
        await plugin('start', 'settings.plugins', {
            id: 'lumence.settings.plugins',
            dependencies: { 'lumence.setings': {} },
        })

        await expect(getInternalPluginManifests(root)).rejects.toThrow(
            /"lumence.setings", which is not an internal plugin/,
        )
    })

    it('allows reserved dependencies, which no plugin declares', async () => {
        await plugin('preinit', 'logging', {
            id: 'lumence.logging',
            dependencies: { 'lumence.api': {}, discord: {} },
        })

        await expect(getInternalPluginManifests(root)).resolves.toBeDefined()
    })

    it('keeps the version of a stub', async () => {
        await plugin('start', 'settings.themes', {
            id: 'lumence.settings.themes',
            version: '1.0.0-beta1',
            defaultSource: { repo: 'https://example.com' },
        })

        const [stub] = await getInternalPluginManifests(root)
        expect(stub).toMatchObject({ version: '1.0.0-beta1' })
    })

    it('keeps the metadata of a stub', async () => {
        await plugin('start', 'settings.themes', {
            id: 'lumence.settings.themes',
            name: 'Theme Settings',
            description: 'Manage your themes.',
            author: 'Lumence',
            icon: 'PaintPaletteIcon',
            defaultSource: { repo: 'https://example.com' },
        })

        const [stub] = await getInternalPluginManifests(root)
        expect(stub).toMatchObject({
            name: 'Theme Settings',
            description: 'Manage your themes.',
            author: 'Lumence',
            icon: 'PaintPaletteIcon',
        })
    })

    it('formats stub contributor objects into strings for native', async () => {
        await plugin('start', 'settings.themes', {
            id: 'lumence.settings.themes',
            author: { name: 'Jane', id: '123456789012345678' },
            contributors: ['John', { name: 'Bob' }],
            defaultSource: { repo: 'https://example.com' },
        })

        const [stub] = await getInternalPluginManifests(root)
        expect(stub).toMatchObject({
            author: 'Jane <123456789012345678>',
            contributors: ['John', 'Bob'],
        })
    })

    it('rejects a version on a plugin that is not a stub', async () => {
        await plugin('start', 'settings', {
            id: 'lumence.settings',
            version: '1.0.0',
        })

        await expect(getInternalPluginManifests(root)).rejects.toThrow(
            /only stubs/,
        )
    })

    it('rejects an invalid stub version', async () => {
        await plugin('start', 'settings.themes', {
            id: 'lumence.settings.themes',
            version: 'v1',
            defaultSource: { repo: 'https://example.com' },
        })

        await expect(getInternalPluginManifests(root)).rejects.toThrow(
            /invalid version/,
        )
    })

    it('rejects two plugins claiming one ID', async () => {
        await plugin('preinit', 'settings', { id: 'lumence.settings' })
        await plugin('start', 'settings', { id: 'lumence.settings' })

        await expect(getInternalPluginManifests(root)).rejects.toThrow(
            /share the ID "lumence.settings"/,
        )
    })
})
