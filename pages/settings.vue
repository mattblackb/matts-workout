<script setup lang="ts">
import type { ExerciseType } from '~/composables/useTracker'
const { state, sorted, addExercise, deleteExercise } = useTracker()
const name = ref('')
const type = ref<ExerciseType>('weighted')

function submit() {
  if (!name.value.trim()) return
  addExercise(name.value, type.value)
  name.value = ''
}
function remove(id: string, n: string) {
  if (confirm(`Delete "${n}"? It will be removed from your routine (logged history is kept).`)) deleteExercise(id)
}
</script>

<template>
  <section>
    <h2>Add an exercise</h2>
    <form class="add" @submit.prevent="submit">
      <label class="field">
        <span>Name</span>
        <input v-model="name" required placeholder="e.g. Chin-ups" />
      </label>
      <label class="field">
        <span>Type</span>
        <select v-model="type">
          <option value="weighted">Weighted (weight × reps)</option>
          <option value="bodyweight">Bodyweight (assisted / added weight)</option>
          <option value="cardio">Cardio (time / level)</option>
        </select>
      </label>
      <button class="btn">Add exercise</button>
    </form>

    <h2>All exercises ({{ sorted.length }})</h2>
    <ul class="plain list">
      <li v-for="e in sorted" :key="e.id" class="row">
        <span class="grow">{{ e.name }} <span class="badge">{{ typeLabel(e.type) }}</span></span>
        <button type="button" class="btn secondary" :aria-label="`Delete ${e.name}`" @click="remove(e.id, e.name)">Delete</button>
      </li>
    </ul>

    <h2>Settings</h2>
    <label class="field">
      <span>Weight unit</span>
      <select v-model="state.unit">
        <option value="kg">Kilograms (kg)</option>
        <option value="lb">Pounds (lb)</option>
      </select>
    </label>
  </section>
</template>
