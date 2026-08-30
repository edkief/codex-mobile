import { describe, expect, it } from 'vitest'
import { appPath, normalizeBasePath, stripAppBasePath } from './basePath'

describe('configurable base path', () => {
  it('normalizes optional leading and trailing slashes', () => {
    expect(normalizeBasePath('codex/workspace-1/')).toBe('/codex/workspace-1')
    expect(normalizeBasePath('/')).toBe('')
  })

  it('prefixes application routes exactly once', () => {
    expect(appPath('/codex-api/rpc', '/codex/workspace-1')).toBe('/codex/workspace-1/codex-api/rpc')
    expect(appPath('/codex/workspace-1/codex-api/rpc', '/codex/workspace-1')).toBe('/codex/workspace-1/codex-api/rpc')
  })

  it('strips the configured prefix when inspecting application URLs', () => {
    expect(stripAppBasePath('/codex/workspace-1/codex-local-image?path=x', '/codex/workspace-1'))
      .toBe('/codex-local-image?path=x')
  })

  it('rejects traversal and non-path delimiters', () => {
    expect(() => normalizeBasePath('/codex/../other')).toThrow()
    expect(() => normalizeBasePath('/codex/workspace?active=1')).toThrow()
  })
})
