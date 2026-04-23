<script setup lang="ts">
import { computed, ref, watch } from "vue";

const COLORS = [
  "text-bg-primary",
  "text-bg-warning",
  "text-bg-tertiary",
  "text-bg-danger",
  "text-bg-info",
  "text-bg-success",
];

const props = defineProps<{
  image?: string;
  firstName: string;
  lastName: string;
}>();

const imageSrc = ref("");
const initials = computed(() => `${getInitials(props.firstName)}${getInitials(props.lastName)}`.substring(0, 3));

const color = computed(() => {
  const hash = calculateHash(`${props.firstName} ${props.lastName}`);
  const index = hash % COLORS.length;
  return COLORS[index];
});

function getInitials(name: string) {
  return name
    ?.split(/[\s-_]/)
    .map((x) => (x.length > 0 ? x[0] : ""))
    .join("")
    .toUpperCase();
}

function trySetImageSrc(src: string) {
  const img = new Image();
  img.src = src;
  if (img.complete) {
    imageSrc.value = src;
    return;
  }

  img.onload = () => {
    imageSrc.value = src;
  };
}

function calculateHash(value: string) {
  let hash = 0;
  if (!value.length) {
    return hash;
  }
  for (let i = 0; i < value.length; i++) {
    const chr = value.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

watch(
  () => props.image,
  (newImage) => {
    if (!newImage) {
      imageSrc.value = "";
      return;
    }

    trySetImageSrc(newImage);
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <img v-if="imageSrc" class="circle" :src="imageSrc" :alt="`Profilbild, ${firstName} ${lastName}`" />
    <div v-else :class="['circle initials', color]" aria-hidden="true">{{ initials }}</div>
  </div>
</template>

<style lang="scss" scoped>
.circle {
  border-radius: 100%;
  aspect-ratio: 1;
  height: 2rem;
  background: $body-bg;
}

.initials {
  display: flex;
  align-items: center;
  justify-content: center;
  color: $primary;
  font-family: $headings-font-family;
  font-weight: 800;
  font-size: 0.8rem;
}
</style>
