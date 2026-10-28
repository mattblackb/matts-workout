import { createHash, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const digest = (s: string) => createHash('sha256').update(s).digest()

export function requireSyncKey(event: H3Event) {
  const expected = useRuntimeConfig(event).syncPassphrase as string
  if (!expected) throw createError({ statusCode: 503, statusMessage: 'Sync is not configured on the server' })
  const given = getHeader(event, 'x-sync-key') ?? ''
  if (!timingSafeEqual(digest(given), digest(expected))) {
    throw createError({ statusCode: 401, statusMessage: 'Wrong passphrase' })
  }
}
