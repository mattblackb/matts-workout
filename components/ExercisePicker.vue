<script setup lang="ts">
const props = defineProps<{ label: string; exclude?: string[] }>()
const emit = defineEmits<{ select: [id: string] }>()
const { sorted } = useTracker()
const q = ref('')
const uid = useId()

const results = computed(() => {
  const t = q.value.trim().toLowerCase()
  return sorted.value.filter(e => !props.exclude?.includes(e.id) && (!t || e.name.toLowerCase().includes(t)))
})
function pick(id: string) {
  emit('select', id)
  q.value = ''
}
</script>

<template>
  <div class="picker">
    <label class="field" :for="`${uid}-q`">
      <span>{{ label }}</span>
    </label>
    <input :id="`${uid}-q`" v-model="q" type="search" placeholder="Search exercises…" autocomplete="off" :aria-controls="`${uid}-list`" />
    <p class="sr" role="status" aria-live="polite">{{ results.length }} exercises found</p>
    <ul :id="`${uid}-list`" class="plain results">
      <li v-for="e in results" :key="e.id">
        <button type="button" class="opt" @click="pick(e.id)">
          <span>{{ e.name }}</span>
          <span class="badge">{{ typeLabel(e.type) }}</span>
        </button>
      </li>
      <li v-if="!results.length" class="muted pad">No matches. Add it in <NuxtLink to="/settings">Settings</NuxtLink>.</li>
    </ul>
  </div>
</template>
