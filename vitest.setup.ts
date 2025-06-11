import { beforeAll, afterAll, vi } from 'vitest'

beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterAll(() => {
  vi.unstubAllGlobals()
})
