<script setup lang="ts">
defineProps<{ name: string; label?: string }>()
</script>

<template>
  <svg class="icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
    stroke-linecap="round" stroke-linejoin="round" :role="label ? 'img' : undefined" :aria-label="label" :aria-hidden="label ? undefined : 'true'">
    <template v-if="name === 'weighted'">
      <path d="M6 7v10M18 7v10M3 9.5v5M21 9.5v5M6 12h12" />
    </template>
    <template v-else-if="name === 'bodyweight'">
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v6M7 9l5 1 5-1M12 13l-3 6M12 13l3 6" />
    </template>
    <template v-else-if="name === 'cardio'">
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
      <path d="M7 12h2l1.5-2.5 2 4L14 12h3" />
    </template>
    <template v-else-if="name === 'upper'">
      <circle cx="12" cy="6" r="2.5" />
      <path d="M4 20v-3c0-2.2 1.8-4 4-4h8c2.2 0 4 1.8 4 4v3" />
    </template>
    <template v-else-if="name === 'lower'">
      <path d="M8 3h8l1 8-2 10h-2l-1-9-1 9H9L7 11l1-8Z" />
    </template>
    <template v-else-if="name === 'core'">
      <rect x="6" y="3" width="12" height="18" rx="4" />
      <path d="M12 3v18M6 9h12M6 15h12" />
    </template>
    <template v-else-if="name === 'full'">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </template>
  </svg>
</template>
