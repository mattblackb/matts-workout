<script setup lang="ts">
import type { Exercise } from '~/composables/useTracker'

const props = defineProps<{ exercise: Exercise; date: string }>()
const { state, lastSession, formatSet, setsFor, addSet, copyLast, removeSet } = useTracker()

const sets = computed(() => setsFor(props.date, props.exercise.id))
const last = computed(() => lastSession(props.exercise.id, props.date))
const unit = computed(() => state.value.unit)
const cardio = computed(() => props.exercise.type === 'cardio')
const bw = computed(() => props.exercise.type === 'bodyweight')

const num = (e: Event) => {
  const v = (e.target as HTMLInputElement).value
  return v === '' ? null : Number(v)
}
</script>

<template>
  <details class="card">
    <summary>
      <span class="name">{{ exercise.name }}</span>
      <span class="badge" :class="{ done: sets.length }">
        {{ sets.length ? `${sets.length} set${sets.length > 1 ? 's' : ''} logged` : 'Not started' }}
      </span>
    </summary>

    <div class="body">
      <section v-if="last" class="last" :aria-label="`Last session for ${exercise.name}`">
        <h3>Last time · {{ fromDateKey(last.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) }}</h3>
        <ul>
          <li v-for="(s, i) in last.sets" :key="i">{{ formatSet(s, exercise.type) }}</li>
        </ul>
        <button v-if="!sets.length" type="button" class="btn secondary" @click="copyLast(date, exercise)">Copy these sets</button>
      </section>
      <p v-else class="muted">No previous sessions yet.</p>

      <label class="field">
        <span>Notes</span>
        <textarea v-model="exercise.notes" rows="2" placeholder="Cues, seat settings, goals…" />
      </label>

      <h3>{{ cardio ? "Today's intervals" : "Today's sets" }}</h3>
      <ol class="sets">
        <li v-for="(s, i) in sets" :key="i" class="set">
          <span class="num" aria-hidden="true">{{ i + 1 }}</span>
          <fieldset>
            <legend class="sr">Set {{ i + 1 }}</legend>
            <template v-if="cardio">
              <label class="field sm">
                <span>Time (min)</span>
                <input :value="s.minutes" type="number" inputmode="decimal" min="0" step="any" @input="s.minutes = num($event)" />
              </label>
              <label class="field sm">
                <span>Level</span>
                <input :value="s.level" type="number" inputmode="decimal" min="0" step="any" @input="s.level = num($event)" />
              </label>
            </template>
            <template v-else-if="bw">
              <label class="check">
                <input v-model="s.assisted" type="checkbox" />
                <span>Assisted</span>
              </label>
              <label v-if="s.assisted" class="field sm">
                <span>Assist ({{ unit }})</span>
                <input :value="s.assist" type="number" inputmode="decimal" min="0" step="any" @input="s.assist = num($event)" />
              </label>
              <label v-else class="field sm">
                <span>Added ({{ unit }})</span>
                <input :value="s.weight" type="number" inputmode="decimal" min="0" step="any" placeholder="0" @input="s.weight = num($event)" />
              </label>
            </template>
            <label v-else class="field sm">
              <span>Weight ({{ unit }})</span>
              <input :value="s.weight" type="number" inputmode="decimal" min="0" step="any" @input="s.weight = num($event)" />
            </label>
            <label v-if="!cardio" class="field sm">
              <span>Reps</span>
              <input :value="s.reps" type="number" inputmode="numeric" min="0" step="1" @input="s.reps = num($event)" />
            </label>
          </fieldset>
          <button type="button" class="btn icon" :aria-label="`Remove set ${i + 1}`" @click="removeSet(date, exercise.id, i)">✕</button>
        </li>
      </ol>
      <button type="button" class="btn" @click="addSet(date, exercise)">{{ cardio ? "+ Add interval" : "+ Add set" }}</button>
    </div>
  </details>
</template>
