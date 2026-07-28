<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import HeaderComponent from "./components/HeaderComponent.vue";
import { useUserStore } from "./stores/user";
import { getAuth } from "firebase/auth";
import AlertComponent, { AlertStatus } from "./components/AlertComponent.vue";
import { RouteName } from "./router/index.js";

const userStore = useUserStore();

const alert = reactive({
  show: false,
  status: AlertStatus.Success,
  message: "",
  autoHideMs: 400,
});

function tryLogin() {
  const auth = getAuth();
  if (!!auth.currentUser) {
    userStore.setLoginSuccess(auth.currentUser, (isSuccess: boolean, message: string) => {
      alert.message = message;
      alert.status = isSuccess ? AlertStatus.Success : AlertStatus.Error;
      alert.show = true;
      alert.autoHideMs = isSuccess ? 6000 : 0;
    });
    return true;
  }
  return false;
}

onBeforeMount(() => {
  const isLoggedIn = tryLogin();
  if (!isLoggedIn) {
    setTimeout(tryLogin, 500);
  }
});
</script>

<template>
  <div class="app-container">
    <HeaderComponent />
    <div class="content">
      <main>
        <router-view />
      </main>
      <AlertComponent
        v-if="alert.show"
        :status="alert.status"
        @hide="alert.show = false"
        :auto-hide-ms="alert.autoHideMs"
      >
        {{ alert.message }}
      </AlertComponent>
    </div>
    <footer class="text-bg-dark py-5 mt-3">
      <div class="container">
        <div>KFUM Voxette</div>
        Org.nr: 875003-0796
        <div class="d-flex gap-2">
          <RouterLink :to="{ name: RouteName.About }">Om föreningen</RouterLink>
          <span aria-hidden="true" class="text-primary">|</span>
          <RouterLink :to="{ name: RouteName.Contact }">Kontakt</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  margin-top: 3.5rem;
  flex: 1;
}
</style>

<style lang="scss">
h1 {
  padding-top: 1.5rem;
}
.text-width {
  max-width: 80ch;
}
</style>
