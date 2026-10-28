<script setup lang="ts">
const { state, byId, formatSet, saveError } = useTracker()
const days = computed(() => Object.keys(state.value.logs).sort().reverse())
</script>

<template>
  <section>
    <h2>History</h2>
    <p v-if="saveError" role="alert" class="alert">Couldn't save to this browser's storage. Free up space or disable private mode.</p>
    <p v-if="!days.length" class="muted">No workouts logged yet.</p>
    <details v-for="d in days" :key="d" class="card">
      <summary>
        <span class="lead"><DayIcon :day="fromDateKey(d).getDay()" /><span class="name">{{ fromDateKey(d).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) }}</span></span>
        <span class="badge">{{ Object.keys(state.logs[d]).length }} exercises</span>
      </summary>
      <div class="body">
        <section v-for="(sets, id) in state.logs[d]" :key="id">
          <h3 class="with-icons">
            {{ byId(String(id))?.name ?? 'Deleted exercise' }}
            <ExerciseTags v-if="byId(String(id))" :exercise="byId(String(id))!" />
          </h3>
          <ul>
            <li v-for="(s, i) in sets" :key="i">{{ formatSet(s, byId(String(id))?.type ?? 'weighted') }}</li>
          </ul>
        </section>
      </div>
    </details>
  </section>
</template>
