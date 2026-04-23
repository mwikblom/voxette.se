<script setup lang="ts">
import { onBeforeMount } from "vue";
import HeaderComponent from "./components/HeaderComponent.vue";
import { useUserStore } from "./stores/user";
import { getAuth } from "firebase/auth";

const userStore = useUserStore();

function tryLogin() {
  const auth = getAuth();
  console.log(auth.currentUser);
  if (!!auth.currentUser) {
    userStore.setLoginSuccess(auth.currentUser, (success: boolean, message: string) => console.log(success, message));
    return true;
  }
  return false;
}

onBeforeMount(() => {
  const isLoggedIn = tryLogin();
  if (!isLoggedIn) {
    setTimeout(tryLogin, 400);
  }
});
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
