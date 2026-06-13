<script setup lang="ts">
import { onBeforeMount, reactive } from "vue";
import HeaderComponent from "./components/HeaderComponent.vue";
import { useUserStore } from "./stores/user";
import { getAuth } from "firebase/auth";
import AlertComponent, { AlertStatus } from "./components/AlertComponent.vue";

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
  <HeaderComponent />
  <div class="content">
    <router-view />
    <AlertComponent
      v-if="alert.show"
      :status="alert.status"
      @hide="alert.show = false"
      :auto-hide-ms="alert.autoHideMs"
    >
      {{ alert.message }}
    </AlertComponent>
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
.text-width {
  max-width: 80ch;
}
</style>
