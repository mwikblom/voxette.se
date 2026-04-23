<script setup lang="ts">
defineProps<{ src: string; alt: string }>();
</script>

<template>
  <div class="cover-image-container">
    <img class="cover-image" :src :alt />
  </div>
</template>

<style lang="scss" scoped>
.cover-image-container {
  background: $black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  object-fit: cover;
  object-position: 0 40%;
  aspect-ratio: 3/1;
  max-height: 20rem;
}
</style>
