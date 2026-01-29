<script setup lang="ts"></script>

<template>
  <div class="cover-image-container">
    <img
      class="cover-image"
      src="/images/14-DSC_3937.webp"
      alt="En kvinnokör i jordnära färger och blomkransar i håret som sjunger med inlevelse"
    />
  </div>
  <div class="container">
    <h1>Välkommen till Voxette</h1>
  </div>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";

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
