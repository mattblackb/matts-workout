<script setup lang="ts">
const { state, routineFor } = useTracker()
const date = ref(toDateKey(new Date()))
const extras = ref<string[]>([])

watch(date, () => { extras.value = [] })

const planned = computed(() => routineFor(date.value))
const list = computed(() => {
  const ids = new Set(planned.value.map(e => e.id))
  // Also show anything already logged that day, plus manually added exercises
  const logged = Object.keys(state.value.logs[date.value] || {})
  const more = [...logged, ...extras.value].filter((id, i, a) => !ids.has(id) && a.indexOf(id) === i)
  return [...planned.value, ...(more.map(id => state.value.exercises.find(e => e.id === id)).filter(Boolean) as any[])]
})
const shift = (n: number) => {
  const d = fromDateKey(date.value)
  d.setDate(d.getDate() + n)
  date.value = toDateKey(d)
}
const pretty = computed(() => fromDateKey(date.value).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }))
</script>

<template>
  <section>
    <div class="datebar">
      <button type="button" class="btn icon" aria-label="Previous day" @click="shift(-1)">‹</button>
      <label class="field">
        <span class="sr">Date</span>
        <input v-model="date" type="date" />
      </label>
      <button type="button" class="btn icon" aria-label="Next day" @click="shift(1)">›</button>
    </div>
    <h2 aria-live="polite">{{ pretty }}</h2>

    <p v-if="!list.length" class="muted">
      Nothing planned for this day. Set up a <NuxtLink to="/routine">routine</NuxtLink> or add an exercise below.
    </p>

    <ExerciseCard v-for="ex in list" :key="ex.id + date" :exercise="ex" :date="date" />

    <ExercisePicker label="Add another exercise to this day" :exclude="list.map(l => l.id)" @select="extras.push($event)" />
  </section>
</template>
