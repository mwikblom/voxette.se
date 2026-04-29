<script setup lang="ts">
import { ref } from "vue";
import ModalComponent from "./ModalComponent.vue";
import FirebaseApi from "@/helpers/FirebaseApi";

const emit = defineEmits<{ added: [] }>();

const isOpen = ref(false);
const error = ref("");

const usePassword = ref(false);
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const initialPassword = ref("");

function handleSubmit() {
  error.value = "";
  if (!email.value) {
    error.value = "Ange e-post";
    return;
  }
  if (usePassword.value && !initialPassword.value) {
    error.value = "Ange lösenord";
    return;
  }

  FirebaseApi.addMember(email.value, initialPassword.value, firstName.value, lastName.value, () => {
    emit("added");
    handleCancel();
  });
}

function handleCancel() {
  isOpen.value = false;
  error.value = "";
  usePassword.value = false;
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  initialPassword.value = "";
}
</script>

<template>
  <button type="button" class="btn btn-tertiary" @click="isOpen = true">
    <i class="bi bi-person-plus" aria-label="Lägg till medlem"></i>
  </button>
  <ModalComponent
    v-if="isOpen"
    v-model:is-open="isOpen"
    title="Lägg till medlem"
    id="add-member-modal"
    @hide="handleCancel"
  >
    <form @submit.prevent="handleSubmit" id="add-member">
      <div class="mb-3">
        <div class="form-check">
          <input
            v-model="usePassword"
            class="form-check-input"
            type="radio"
            name="login-type"
            id="login-type-gmail"
            :value="false"
          />
          <label class="form-check-label" for="login-type-gmail">Logga in med Gmail</label>
        </div>
        <div class="form-check">
          <input
            v-model="usePassword"
            class="form-check-input"
            type="radio"
            name="login-type"
            id="login-type-password"
            :value="true"
          />
          <label class="form-check-label" for="login-type-password">Logga in med e-post och lösenord</label>
        </div>
      </div>
      <div class="row">
        <div class="col col-sm-6 col-12">
          <div class="mb-3">
            <label for="new-member-first-name" class="form-label">Förnamn</label>
            <input v-model="firstName" type="text" class="form-control" id="new-member-first-name" />
          </div>
        </div>
        <div class="col col-sm-6 col-12">
          <div class="mb-3">
            <label for="new-member-last-name" class="form-label">Efternamn</label>
            <input v-model="lastName" type="text" class="form-control" id="new-member-last-name" />
          </div>
        </div>

        <div class="col col-12">
          <div class="mb-3">
            <label for="new-member-email" class="form-label">E-post</label>
            <input
              v-model="email"
              type="email"
              class="form-control"
              id="new-member-email"
              autocomplete="new-email"
              required
            />
          </div>
        </div>
        <div v-if="usePassword" class="col col-12">
          <div class="mb-3">
            <label for="new-member-password" class="form-label">Initialt lösenord</label>
            <input
              v-model="initialPassword"
              type="password"
              class="form-control"
              id="new-member-password"
              autocomplete="new-password"
              required
            />
          </div>
        </div>
      </div>
    </form>
    <p v-if="error" class="text-danger">{{ error }}</p>
    <template #footer>
      <button type="submit" class="btn btn-primary" form="add-member">Lägg till</button>
    </template>
  </ModalComponent>
</template>
