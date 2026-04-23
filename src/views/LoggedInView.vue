<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
  <router-view v-if="userStore.isLoggedIn" />
  <div v-else class="container">
    <h1>Logga in</h1>
    <p>Sidan du försökt navigera till kräver inloggning. Logga in på ditt konto via knappen i menyn.</p>
  </div>
</template>
