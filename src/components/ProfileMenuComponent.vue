<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import ProfileIconComponent from "./ProfileIconComponent.vue";
import { RouteName } from "@/router";
import { useRouter } from "vue-router";
import { getAuth, signOut, updatePassword, type Auth } from "firebase/auth";
import FirebaseApi from "@/helpers/FirebaseApi";
import { computed, onMounted, ref } from "vue";
import ModalComponent from "./ModalComponent.vue";

const emit = defineEmits<{ logout: []; changedPassword: [] }>();

const userStore = useUserStore();
const router = useRouter();

const showChangePassword = ref(false);
const auth = ref<Auth>();
const newPassword = ref("");
const error = ref("");
const hasPasswordLogin = computed(() => auth.value?.currentUser?.providerData.some((x) => x.providerId === "password"));

async function handleLogout() {
  userStore.setUser(undefined);
  await signOut(getAuth());
  emit("logout");
  router.push({ name: RouteName.Home });
}

function handleUpdatePicture() {
  if (userStore.newPicture) {
    handleChangePicture(userStore.newPicture);
  }
}

function handleRemovePicture() {
  handleChangePicture("");
}

function handleChangePicture(url: string) {
  const user = userStore.user;
  if (!user?.memberId) {
    return;
  }

  user.picture = url;
  userStore.setUser(user);

  FirebaseApi.saveUserData(user.memberId, user.AllUserData);
}

async function handleChangePassword() {
  if (!auth.value?.currentUser) {
    auth.value = getAuth();
  }
  try {
    await updatePassword(auth.value.currentUser!, newPassword.value);
    showChangePassword.value = false;
    emit("changedPassword");
  } catch (e) {
    console.error(e);
    error.value =
      !!e && typeof e == "object" && "message" in e ? (e.message as string) : "Oväntat fel vid ändring av lösenord.";
  }
}

onMounted(() => {
  auth.value = getAuth();
});
</script>

<template>
  <div class="nav-item dropdown">
    <a
      href="#"
      role="button"
      class="nav-link dropdown-toggle d-flex gap-3 align-items-center"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <ProfileIconComponent
        v-if="userStore.user"
        :image="userStore.user.picture"
        :first-name="userStore.user.FirstName"
        :last-name="userStore.user.LastName"
      />
      <span class="name">{{ userStore.user?.FirstName }} {{ userStore.user?.LastName }}</span>
    </a>
    <ul class="dropdown-menu">
      <li v-if="userStore.hasNewPicture">
        <button type="button" class="dropdown-item" @click="handleUpdatePicture">Uppdatera bild</button>
      </li>
      <li v-if="userStore.user?.Picture">
        <button type="button" class="dropdown-item" @click="handleRemovePicture">Ta bort bild</button>
      </li>
      <li><button type="button" class="dropdown-item" @click="showChangePassword = true">Byt lösenord</button></li>
      <li v-if="hasPasswordLogin">
        <button type="button" class="dropdown-item" @click="handleLogout">Logga ut</button>
      </li>
    </ul>
  </div>
  <ModalComponent
    id="change-password"
    v-model:is-open="showChangePassword"
    :title="`Ändra lösenord för ${userStore.user?.Email}`"
  >
    <form @change.prevent="handleChangePassword">
      <div class="mb-3">
        <label for="new-password" class="form-label">Nytt lösenord</label>
        <input v-model="newPassword" type="password" class="form-control" id="new-password" />
      </div>
      <button type="submit" class="btn btn-primary">Ändra lösenord</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </ModalComponent>
</template>
