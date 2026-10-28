<script setup lang="ts">
const props = defineProps<{ day: number }>()
const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const isToday = computed(() => new Date().getDay() === props.day)
</script>

<template>
  <svg class="dayicon" :class="{ today: isToday }" viewBox="0 0 24 24" width="28" height="28" aria-hidden="true">
    <rect x="3" y="4.5" width="18" height="16.5" rx="3.5" fill="none" stroke="currentColor" stroke-width="2" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    <text x="12" y="18.2" text-anchor="middle" font-size="8.5" font-weight="700" fill="currentColor">{{ letters[day] }}</text>
  </svg>
</template>
