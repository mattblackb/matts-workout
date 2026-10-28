export default defineEventHandler(async (event) => {
  requireSyncKey(event)
  const stored = await useStorage('data').getItem<{ updatedAt: number, data: unknown }>('state')
  setHeader(event, 'Cache-Control', 'no-store')
  return stored ?? { updatedAt: 0, data: null }
})
