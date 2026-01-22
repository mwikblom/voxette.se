<script setup lang="ts">
import HeaderComponent from "./components/HeaderComponent.vue";
</script>

<template>
  <HeaderComponent />
  <div class="content">
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.content {
  margin-top: 3.5rem;
}
</style>
<style lang="scss">
h1 {
  padding-top: 1.5rem;
}
</style>
