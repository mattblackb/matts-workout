<script setup lang="ts">
import type { BodyArea, ExerciseType } from '~/composables/useTracker'
const { exportJson, importJson, state, sorted, addExercise, deleteExercise } = useTracker()
const name = ref('')
const type = ref<ExerciseType>('weighted')
const area = ref<BodyArea>('upper')

function submit() {
  if (!name.value.trim()) return
  addExercise(name.value, type.value, area.value)
  name.value = ''
}
function remove(id: string, n: string) {
  if (confirm(`Delete "${n}"? It will be removed from your routine (logged history is kept).`)) deleteExercise(id)
}

const sync = useSync()
const passphrase = ref('')
const message = ref('')
const failed = ref(false)
const fileInput = ref<HTMLInputElement>()

function backup() {
  const blob = new Blob([exportJson()], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `workout-tracker-${toDateKey(new Date())}.json`
  a.click()
  URL.revokeObjectURL(url)
  failed.value = false
  message.value = 'Backup downloaded.'
}

async function restore(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (!confirm('Restoring replaces ALL current data on this device with the backup. Continue?')) return
  const err = importJson(await file.text())
  failed.value = !!err
  message.value = err ?? 'Backup restored.'
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
      <label class="field">
        <span>Body area</span>
        <select v-model="area">
          <option v-for="a in AREAS" :key="a" :value="a">{{ areaLabel(a) }}</option>
        </select>
      </label>
      <button class="btn">Add exercise</button>
    </form>

    <h2>All exercises ({{ sorted.length }})</h2>
    <ul class="plain list">
      <li v-for="e in sorted" :key="e.id" class="row">
        <span class="grow titles">
          <span>{{ e.name }}</span>
          <ExerciseTags :exercise="e" />
        </span>
        <label class="area-pick">
          <span class="sr">Body area for {{ e.name }}</span>
          <select :value="areaOf(e)" @change="e.area = ($event.target as HTMLSelectElement).value as BodyArea">
            <option v-for="a in AREAS" :key="a" :value="a">{{ areaLabel(a) }}</option>
          </select>
        </label>
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

    <h2>Backup &amp; restore</h2>
    <p class="muted">Your data lives only in this browser. Download a backup file to keep it safe or move it to another device.</p>
    <div class="add">
      <button type="button" class="btn" @click="backup">Download backup</button>
      <button type="button" class="btn secondary" @click="fileInput?.click()">Restore from file…</button>
      <input ref="fileInput" type="file" accept="application/json,.json" class="sr" tabindex="-1" aria-label="Backup file" @change="restore" />
    </div>
    <p role="status" :class="failed ? 'alert' : 'muted'">{{ message }}</p>

    <h2>Sync across devices</h2>
    <p class="muted">Keeps your data in sync between browsers and devices using the passphrase set on your Netlify site. The app still works offline and syncs when you're back online.</p>
    <template v-if="sync.status.value === 'off'">
      <form class="add" @submit.prevent="sync.connect(passphrase)">
        <label class="field">
          <span>Sync passphrase</span>
          <input v-model="passphrase" type="password" autocomplete="current-password" required />
        </label>
        <button class="btn">Connect</button>
      </form>
    </template>
    <template v-else>
      <p>
        <span class="badge" :class="{ done: sync.status.value === 'idle' }">
          {{ sync.status.value === 'syncing' ? 'Syncing…' : sync.status.value === 'error' ? 'Sync problem' : 'Sync on' }}
        </span>
        <span v-if="sync.lastSynced.value" class="muted"> Last synced {{ new Date(sync.lastSynced.value).toLocaleTimeString() }}</span>
      </p>
      <div class="add">
        <button type="button" class="btn" :disabled="sync.status.value === 'syncing'" @click="sync.syncNow()">Sync now</button>
        <button type="button" class="btn secondary" @click="sync.disconnect()">Disconnect this device</button>
      </div>
    </template>
    <p role="status" :class="sync.status.value === 'error' ? 'alert' : 'muted'">{{ sync.message.value }}</p>
  </section>
</template>
