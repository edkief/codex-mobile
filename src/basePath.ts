function readInjectedBasePath(): string {
  if (typeof document === 'undefined') return ''
  const value = document.querySelector<HTMLMetaElement>('meta[name="codexui-base-path"]')?.content ?? ''
  return value === '__CODEXUI_BASE_PATH__' ? '' : value
}

export function normalizeBasePath(value: string | undefined | null): string {
  const trimmed = value?.trim() ?? ''
  if (!trimmed || trimmed === '/') return ''
  if (trimmed.includes('?') || trimmed.includes('#') || trimmed.includes('\\') || /[\s"'<>]/u.test(trimmed)) {
    throw new Error('CODEXUI_BASE_PATH must contain only URL path segments')
  }

  const normalized = `/${trimmed.replace(/^\/+|\/+$/gu, '')}`.replace(/\/{2,}/gu, '/')
  if (normalized.split('/').some((segment) => segment === '.' || segment === '..')) {
    throw new Error('CODEXUI_BASE_PATH cannot contain . or .. segments')
  }
  return normalized
}

export function getAppBasePath(): string {
  const injected = readInjectedBasePath()
  if (injected) return normalizeBasePath(injected)

  const viteBasePath = typeof import.meta.env.VITE_CODEXUI_BASE_PATH === 'string'
    ? import.meta.env.VITE_CODEXUI_BASE_PATH
    : ''
  return normalizeBasePath(viteBasePath)
}

export function appPath(path: string, basePath = getAppBasePath()): string {
  if (!path.startsWith('/')) return path
  const normalizedBasePath = normalizeBasePath(basePath)
  if (!normalizedBasePath || path === normalizedBasePath || path.startsWith(`${normalizedBasePath}/`)) return path
  return `${normalizedBasePath}${path}`
}

export function stripAppBasePath(path: string, basePath = getAppBasePath()): string {
  const normalizedBasePath = normalizeBasePath(basePath)
  if (!normalizedBasePath) return path
  if (path === normalizedBasePath) return '/'
  return path.startsWith(`${normalizedBasePath}/`) ? path.slice(normalizedBasePath.length) : path
}

export function appFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(typeof input === 'string' ? appPath(input) : input, init)
}

export function appWebSocketUrl(path: string): string {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return `${protocol}//${window.location.host}${appPath(path)}`
}
