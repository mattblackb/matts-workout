<script setup lang="ts">
const { state, byId } = useTracker()
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const add = (d: number, id: string) => {
  state.value.routine[d] = [...(state.value.routine[d] || []), id]
}
const remove = (d: number, i: number) => state.value.routine[d].splice(i, 1)
const move = (d: number, i: number, n: number) => {
  const a = state.value.routine[d]
  const j = i + n
  if (j < 0 || j >= a.length) return
  ;[a[i], a[j]] = [a[j], a[i]]
}
</script>

<template>
  <section>
    <h2>Weekly routine</h2>
    <p class="muted">Choose the exercises that appear on each day.</p>
    <details v-for="(name, d) in days" :key="d" class="card" :open="new Date().getDay() === d">
      <summary>
        <span class="lead"><DayIcon :day="d" /><span class="name">{{ name }}</span></span>
        <span class="badge">{{ (state.routine[d] || []).length }} exercises</span>
      </summary>
      <div class="body">
        <ol class="plain">
          <li v-for="(id, i) in state.routine[d] || []" :key="id + i" class="row">
            <span class="grow titles">
              <span>{{ byId(id)?.name }}</span>
              <ExerciseTags v-if="byId(id)" :exercise="byId(id)!" />
            </span>
            <button type="button" class="btn icon" :aria-label="`Move ${byId(id)?.name} up`" :disabled="i === 0" @click="move(d, i, -1)">↑</button>
            <button type="button" class="btn icon" :aria-label="`Move ${byId(id)?.name} down`" :disabled="i === state.routine[d].length - 1" @click="move(d, i, 1)">↓</button>
            <button type="button" class="btn icon" :aria-label="`Remove ${byId(id)?.name} from ${name}`" @click="remove(d, i)">✕</button>
          </li>
        </ol>
        <ExercisePicker :label="`Add exercise to ${name}`" @select="add(d, $event)" />
      </div>
    </details>
  </section>
</template>
