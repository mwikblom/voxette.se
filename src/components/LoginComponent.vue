<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import ModalComponent from "./ModalComponent.vue";
import { ref } from "vue";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  type User as FirebaseUser,
} from "firebase/auth";
import FirebaseApi from "@/helpers/FirebaseApi";
import User from "@/models/User";

const emit = defineEmits<{ login: [boolean, string] }>();

const userStore = useUserStore();

const isLoginModalOpen = ref(false);
const email = ref("");
const password = ref("");
const error = ref("");

function handleStartLogin() {
  isLoginModalOpen.value = true;
}

async function handleLoginWithPassword() {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!!user) {
      // User is already logged in
      setLoginSuccess(user);
      return;
    }

    const credentials = await signInWithEmailAndPassword(auth, email.value, password.value);
    setLoginSuccess(credentials.user);
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
      setLoginSuccess(user);
      return;
    }

    auth.useDeviceLanguage();

    const credentials = await signInWithPopup(auth, new GoogleAuthProvider());
    setLoginSuccess(credentials.user);
  } catch (e) {
    console.error(e);
    userStore.setUser(undefined);
    emit("login", false, "Inloggning med Gmail misslyckades.");
  }

  isLoginModalOpen.value = false;
}

async function setLoginSuccess(user: FirebaseUser) {
  if (!user.email) {
    throw new Error("User email is required.");
  }

  FirebaseApi.fetchUserData(user.email, (userData) => {
    if (!userData) {
      userStore.setUser(undefined);
      emit("login", false, `Hoppsan! Användare ${user.email} saknas.`);
      return;
    }

    if (userData.googleId) {
      userStore.setUser(new User(user.uid, userData, user.email!, user.photoURL));
      emit("login", true, "Du är nu inloggad!");
      return;
    }

    // First login - generate the user data
    const newUser = new User(user.uid, user.displayName, user.email, user.photoURL);
    const initialUserData = newUser.InitialUserData;

    FirebaseApi.saveUserData(userData.memberId!, initialUserData, () => {
      userStore.setUser(newUser);
      emit("login", true, `Skapade användare för ${newUser.FirstName}`);
    });
  });
}
</script>

<template>
  <button v-if="!userStore.isLoggedIn" class="btn btn-outline-light my-2 my-sm-0" @click="handleStartLogin">
    Logga in
  </button>
  <ModalComponent v-model:is-open="isLoginModalOpen" id="login-modal" title="Logga in">
    <h2 class="h4 mb-3 text-tertiary">Logga in med Gmail</h2>
    <button type="button" @click="handleLoginWithGmail" class="btn btn-tertiary">Logga in med Gmail</button>

    <h2 class="h4 mt-5">Logga in med epost och lösenord</h2>
    <form @submit.prevent="handleLoginWithPassword">
      <div class="mb-2">
        <label for="email" class="form-label">Epost</label>
        <input v-model="email" type="email" class="form-control" id="email" />
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
