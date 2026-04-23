<script setup lang="ts">
import { RouteName } from "@/router";
import { useUserStore } from "@/stores/user";
import { computed, reactive } from "vue";
import { useRoute } from "vue-router";
import LoginComponent from "./LoginComponent.vue";
import ProfileMenuComponent from "./ProfileMenuComponent.vue";
import AlertComponent, { AlertStatus } from "./AlertComponent.vue";

const route = useRoute();
const userStore = useUserStore();

const menuItems = computed(() => [
  { route: { name: RouteName.Contact }, label: "Kontakt" },
  { route: { name: RouteName.Calendar }, label: "Kalender" },
  { route: { name: RouteName.Conductor }, label: "Dirigent" },
]);

const internalMenuItems = computed(() =>
  userStore.isLoggedIn
    ? [
        { route: { name: RouteName.Members }, label: "Medlemmar" },
        { route: { name: RouteName.InternalCalendar }, label: "Intern kalender" },
        { route: { name: RouteName.Files }, label: "Filer" },
      ]
    : [],
);

const alert = reactive({
  show: false,
  status: AlertStatus.Success,
  message: "",
  autoHideMs: 0,
});

function isActive(name: string) {
  return route.name === name;
}

function handleLogin(isSuccess: boolean, message: string) {
  alert.message = message;
  alert.status = isSuccess ? AlertStatus.Success : AlertStatus.Error;
  alert.show = true;
  alert.autoHideMs = isSuccess ? 6000 : 0;
}

function handleLogout() {
  alert.message = "Du har loggat ut";
  alert.status = AlertStatus.Success;
  alert.show = true;
  alert.autoHideMs = 6000;
}

function handleChangedPassword() {
  alert.message = "Lösenord har ändrats";
  alert.status = AlertStatus.Success;
  alert.show = true;
  alert.autoHideMs = 6000;
}
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark fixed-top">
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
          <li v-if="internalMenuItems.length" class="nav-item">
            <span class="nav-link divider"></span>
          </li>
          <li class="nav-item" v-for="item in internalMenuItems" :key="item.label">
            <RouterLink :class="['nav-link', { active: isActive(item.route.name) }]" :to="item.route">
              {{ item.label }}
            </RouterLink>
          </li>
        </ul>
        <div class="mt-2 mt-md-0 ms-auto">
          <LoginComponent v-if="!userStore.isLoggedIn" @login="handleLogin" />
          <ProfileMenuComponent v-else @logout="handleLogout" @changed-password="handleChangedPassword" />
        </div>
      </div>
    </div>
  </nav>
  <AlertComponent v-if="alert.show" :status="alert.status" @hide="alert.show = false" :auto-hide-ms="alert.autoHideMs">
    {{ alert.message }}
  </AlertComponent>
</template>

<style lang="scss" scoped>
.navbar {
  background: #ff2d86;
  background: linear-gradient(
    120deg,
    rgba(255, 45, 134, 1) 0%,
    rgba(255, 45, 134, 1) 25%,
    rgba(227, 27, 35, 1) 50%,
    rgba(255, 106, 0, 1) 75%,
    rgba(255, 106, 0, 1) 100%
  );
}

.navbar-brand {
  font-family: $headings-font-family;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
}

.divider {
  border-left: 1px solid $light;
  height: 90%;
  width: 1px;
  margin-left: 1rem;
}
.collapse.show .divider {
  border-left: none;
  border-bottom: 1px solid $light;
  width: 100%;
  margin-left: 0;
  margin-bottom: 1rem;
}
</style>
