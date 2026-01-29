<script setup lang="ts">
import { RouteName } from "@/router";
import { useUserStore } from "@/stores/user";
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const menuItems = computed(() => [
  { route: { name: RouteName.Contact }, label: "Kontakt" },
  { route: { name: RouteName.Calendar }, label: "Kalender" },
  { route: { name: RouteName.Conductor }, label: "Dirigent" },
]);

function isActive(name: string) {
  return route.name === name;
}

function handleLogin() {
  // TODO
}

function handleLogout() {
  userStore.setUser(undefined);
  router.push({ name: RouteName.Home });
}
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" :to="{ name: RouteName.Home }">Voxette</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse"
        aria-expanded="false"
        aria-label="Toggla meny"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-for="item in menuItems" :key="item.label">
            <RouterLink :class="['nav-link', { active: isActive(item.route.name) }]" :to="item.route">
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
        <div class="mt-2 mt-md-0 ms-auto">
          <button v-if="!userStore.isLoggedIn" class="btn btn-outline-light my-2 my-sm-0" @click="handleLogin">
            Logga in
          </button>
          <button v-else class="btn btn-outline-light my-2 my-sm-0" @click="handleLogout">Logga ut</button>
        </div>
      </div>
    </div>
  </nav>
</template>
