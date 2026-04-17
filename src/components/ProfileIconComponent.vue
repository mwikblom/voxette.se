<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  image?: string;
  firstName: string;
  lastName: string;
}>();

const initials = computed(() => `${getInitials(props.firstName)}${getInitials(props.lastName)}`.substring(0, 3));

function getInitials(name: string) {
  return name
    ?.split(" ")
    .map((x) => (x.length > 0 ? x[0] : ""))
    .join()
    .toUpperCase();
}
</script>

<template>
  <div>
    <img v-if="image" class="circle" :src="image" :alt="`Profilbild, ${firstName} ${lastName}`" />
    <div v-else class="circle initials" aria-hidden="true">{{ initials }}</div>
  </div>
</template>

<style lang="scss" scoped>
.circle {
  border-radius: 100%;
  aspect-ratio: 1;
  max-height: 2rem;
  background: $body-bg;
}

.initials {
  color: $primary;
  font-family: $headings-font-family;
  font-weight: $headings-font-weight;
}
</style>
