export const SYNC_KEY = 'workout-tracker-sync-key'
export const META_KEY = 'workout-tracker-meta'

let timer: ReturnType<typeof setTimeout> | undefined
let applying = false
let busy = false

export function useSync() {
  const { state, importJson } = useTracker()
  const key = useState<string>('sync-key', () => '')
  const status = useState<'off' | 'idle' | 'syncing' | 'error'>('sync-status', () => 'off')
  const message = useState<string>('sync-message', () => '')
  const lastSynced = useState<number | null>('sync-last', () => null)
  const updatedAt = useState<number>('sync-updated', () => 0)

  const saveMeta = () => localStorage.setItem(META_KEY, JSON.stringify({ updatedAt: updatedAt.value }))
  const headers = () => ({ 'x-sync-key': key.value })

  function init() {
    key.value = localStorage.getItem(SYNC_KEY) ?? ''
    status.value = key.value ? 'idle' : 'off'
    try { updatedAt.value = JSON.parse(localStorage.getItem(META_KEY) || '{}').updatedAt || 0 } catch { /* ignore */ }
  }

  // Called by the persistence watcher on every local edit
  function markChanged() {
    if (applying) return
    updatedAt.value = Date.now()
    saveMeta()
    schedule()
  }

  function schedule() {
    if (!key.value) return
    clearTimeout(timer)
    timer = setTimeout(syncNow, 1500)
  }

  function fail(e: any) {
    status.value = 'error'
    const code = e?.statusCode ?? e?.response?.status
    message.value = code === 401 ? 'Wrong passphrase.'
      : code === 503 ? 'Sync is not set up on the server yet (see README).'
        : 'Could not reach the server. Changes are saved on this device and will sync when back online.'
    return code as number | undefined
  }

  async function syncNow(retry = true): Promise<void> {
    if (!key.value || busy) return
    busy = true
    status.value = 'syncing'
    try {
      const remote = await $fetch<{ updatedAt: number, data: unknown }>('/api/sync', { headers: headers() })
      if (remote.data && remote.updatedAt > updatedAt.value) {
        applying = true
        try {
          const err = importJson(JSON.stringify(remote.data))
          if (err) throw new Error(err)
          updatedAt.value = remote.updatedAt
          saveMeta()
        } finally { applying = false }
      } else if (!remote.data || remote.updatedAt < updatedAt.value) {
        if (!updatedAt.value) { updatedAt.value = Date.now(); saveMeta() }
        await $fetch('/api/sync', { method: 'PUT', headers: headers(), body: { updatedAt: updatedAt.value, data: state.value } })
      }
      status.value = 'idle'
      message.value = ''
      lastSynced.value = Date.now()
    } catch (e: any) {
      const code = e?.statusCode ?? e?.response?.status
      if (code === 409 && retry) {
        busy = false
        return syncNow(false)
      }
      fail(e)
    } finally { busy = false }
  }

  async function connect(passphrase: string) {
    key.value = passphrase
    localStorage.setItem(SYNC_KEY, passphrase)
    await syncNow()
    if (status.value === 'error' && message.value === 'Wrong passphrase.') disconnect(true)
  }

  function disconnect(keepMessage = false) {
    clearTimeout(timer)
    key.value = ''
    localStorage.removeItem(SYNC_KEY)
    status.value = 'off'
    if (!keepMessage) message.value = ''
  }

  return { key, status, message, lastSynced, init, markChanged, syncNow, connect, disconnect }
}
