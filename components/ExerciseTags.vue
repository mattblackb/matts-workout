<script setup lang="ts">
import type { Exercise } from '~/composables/useTracker'
defineProps<{ exercise: Exercise }>()
</script>

<template>
  <span class="tags">
    <span class="tag"><AppIcon :name="exercise.type" /><span>{{ typeLabel(exercise.type) }}</span></span>
    <span class="tag"><AppIcon :name="areaOf(exercise)" /><span>{{ areaLabel(areaOf(exercise)) }}</span></span>
  </span>
</template>
