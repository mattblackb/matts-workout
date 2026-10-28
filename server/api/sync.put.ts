const isObj = (v: unknown) => !!v && typeof v === 'object' && !Array.isArray(v)

export default defineEventHandler(async (event) => {
  requireSyncKey(event)
  const body = await readBody(event)
  const d = body?.data
  if (typeof body?.updatedAt !== 'number' || !isObj(d) || !Array.isArray(d.exercises) || !isObj(d.routine) || !isObj(d.logs)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid data' })
  }
  if (JSON.stringify(d).length > 4_000_000) {
    throw createError({ statusCode: 413, statusMessage: 'Data too large' })
  }
  const storage = useStorage('data')
  const current = await storage.getItem<{ updatedAt: number }>('state')
  if (current && current.updatedAt > body.updatedAt) {
    throw createError({ statusCode: 409, statusMessage: 'Server has newer data' })
  }
  await storage.setItem('state', { updatedAt: body.updatedAt, data: d })
  return { ok: true }
})
