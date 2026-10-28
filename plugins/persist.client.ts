import { STORAGE_KEY, useTracker } from '~/composables/useTracker'

// App-lifetime watcher so saving continues across page navigation
export default defineNuxtPlugin(() => {
  const { state, saveError } = useTracker()
  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
      saveError.value = false
    } catch { saveError.value = true }
  }
  watch(state, save, { deep: true, flush: 'sync' })
  window.addEventListener('pagehide', save)
})
