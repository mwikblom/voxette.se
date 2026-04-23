<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import ModalComponent from "./ModalComponent.vue";
import { ref } from "vue";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const emit = defineEmits<{ login: [boolean, string] }>();

const userStore = useUserStore();

const isLoginModalOpen = ref(false);
const email = ref("");
const password = ref("");
const error = ref("");

function handleStartLogin() {
  isLoginModalOpen.value = true;
}

function emitLogin(isSuccess: boolean, message: string) {
  emit("login", isSuccess, message);
}

async function handleLoginWithPassword() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!!user) {
      // User is already logged in
      userStore.setLoginSuccess(user, emitLogin);
      return;
    }

    const credentials = await signInWithEmailAndPassword(auth, email.value, password.value);
    userStore.setLoginSuccess(credentials.user, emitLogin);
  } catch (e) {
    console.error(e);
    error.value =
      typeof e == "object" && e && "message" in e ? (e.message as string) : "Något gick fel vid inloggning.";
    userStore.setUser(undefined);
    emit("login", false, error.value);
    return;
  }

  isLoginModalOpen.value = false;
}

async function handleLoginWithGmail() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!!user) {
      // User is already logged in
      userStore.setLoginSuccess(user, emitLogin);
      return;
    }

    auth.useDeviceLanguage();

    const credentials = await signInWithPopup(auth, new GoogleAuthProvider());
    userStore.setLoginSuccess(credentials.user, emitLogin);
  } catch (e) {
    console.error(e);
    userStore.setUser(undefined);
    emit("login", false, "Inloggning med Gmail misslyckades.");
  }

  isLoginModalOpen.value = false;
}
</script>

<template>
  <button class="btn btn-outline-light my-2 my-sm-0" @click="handleStartLogin">Logga in</button>
  <ModalComponent v-if="isLoginModalOpen" v-model:is-open="isLoginModalOpen" id="login-modal" title="Logga in">
    <h2 class="h4 mb-3 text-tertiary">Logga in med Gmail</h2>
    <button type="button" @click="handleLoginWithGmail" class="btn btn-tertiary">Logga in med Gmail</button>

    <h2 class="h4 mt-5">Logga in med epost och lösenord</h2>
    <form @submit.prevent="handleLoginWithPassword">
      <div class="mb-2">
        <label for="email" class="form-label">Epost</label>
        <input v-model="email" type="email" class="form-control" id="email" autocomplete="email" />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Lösenord</label>
        <input v-model="password" type="password" class="form-control" id="password" />
      </div>
      <button class="btn btn-primary">Logga in</button>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
  </ModalComponent>
</template>
