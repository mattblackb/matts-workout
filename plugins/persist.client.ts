import { STORAGE_KEY, useTracker } from '~/composables/useTracker'

// App-lifetime watcher so saving continues across page navigation
export default defineNuxtPlugin(() => {
  const { state, saveError } = useTracker()
  const sync = useSync()
  sync.init()

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
      saveError.value = false
    } catch { saveError.value = true }
  }
  watch(state, () => { save(); sync.markChanged() }, { deep: true, flush: 'sync' })
  window.addEventListener('pagehide', save)

  const pull = () => { if (document.visibilityState === 'visible') sync.syncNow() }
  document.addEventListener('visibilitychange', pull)
  window.addEventListener('online', pull)
  sync.syncNow()
})
