<script setup lang="ts">
import ProfileIconComponent from "@/components/ProfileIconComponent.vue";
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import FirebaseApi from "@/helpers/FirebaseApi";
import { clone, isDirty } from "@/helpers/ObjectHelper";
import type { DisplayNameOrUserData } from "@/models/User";
import { computed, onBeforeMount, ref } from "vue";
import Constants from "@/constants";
import { RouteName } from "@/router";
import { useRouter } from "vue-router";

const props = defineProps<{ id: string }>();

const router = useRouter();

const isLoading = ref(true);
const initialMember = ref<DisplayNameOrUserData>();
const member = ref<DisplayNameOrUserData>();
const hasChanges = computed(() => initialMember.value && member.value && isDirty(initialMember.value, member.value));

function handleSubmit() {
  if (!hasChanges.value) {
    return;
  }

  FirebaseApi.saveUserData(props.id, member.value, () => {
    initialMember.value = member.value;
  });
}

function handleDeletePicture() {
  if (!member.value) {
    return;
  }

  member.value.pictureUrl = "";
  handleSubmit();
}

onBeforeMount(() => {
  if (!props.id) {
    isLoading.value = false;
    return;
  }

  FirebaseApi.fetchUserData(props.id, (userData) => {
    isLoading.value = false;
    if (!userData) {
      return;
    }
    if (!userData.tags) {
      userData.tags = [];
    }

    member.value = clone(userData);
    initialMember.value = userData;

    document.title = `${initialMember.value.firstName} ${initialMember.value.lastName} - ${document.title}`;
  });
});
</script>

<template>
  <div class="container">
    <RouterLink :to="{ name: RouteName.Members }" @click.prevent="router.go(-1)" class="d-block pt-3">
      <i aria-hidden class="bi bi-chevron-left" />
      Tillbaka
    </RouterLink>
    <h1>Medlem</h1>
    <SpinnerComponent v-if="isLoading" />
    <p v-else-if="!member" class="text-danger">Medlem kunde inte hämtas.</p>
    <div v-else>
      <div class="d-flex gap-3 align-items-center mb-3">
        <ProfileIconComponent
          :first-name="member.firstName ?? '-'"
          :last-name="member.lastName ?? ''"
          :image="member.pictureUrl"
          size="lg"
        />
        <button v-if="member.pictureUrl" type="button" class="btn btn-outline-danger" @click="handleDeletePicture">
          <i class="bi bi-trash me-1" aria-hidden="true"></i>
          Ta bort bild
        </button>
      </div>
      <form autocomplete="off" @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="firstName" class="form-label">Förnamn</label>
              <input v-model="member.firstName" type="text" class="form-control" id="firstName" />
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="lastName" class="form-label">Efternamn</label>
              <input v-model="member.lastName" type="text" class="form-control" id="lastName" />
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="email" class="form-label">E-post</label>
              <input v-model="member.email" type="email" class="form-control" id="email" />
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="phone" class="form-label">Telefon</label>
              <input v-model="member.phone" type="tel" class="form-control" id="phone" />
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="part" class="form-label">Stämma</label>
              <select v-model="member.part" class="form-select" id="part">
                <option value="">Ingen</option>
                <option v-for="part in Constants.MEMBER_PARTS" :value="part" :key="part">{{ part }}</option>
              </select>
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="startDate" class="form-label">Medlem sedan</label>
              <input v-model="member.startDate" type="date" class="form-control" id="startDate" />
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="address" class="form-label">Adress</label>
              <textarea v-model="member.address" class="form-control" id="address" rows="3"></textarea>
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="allergies" class="form-label">Allergier</label>
              <textarea v-model="member.allergies" class="form-control" id="allergies" rows="3"></textarea>
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-lg-4">
            <div class="mb-3">
              <label for="tags" class="form-label">Taggar</label>
              <select v-model="member.tags" class="form-select" id="tags" multiple>
                <option v-for="tag in Constants.MEMBER_TAGS" :value="tag" :key="tag">{{ tag }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-3">
          <RouterLink :to="{ name: RouteName.Members }" class="btn btn-secondary" @click.prevent="router.go(-1)">
            Avbryt
          </RouterLink>
          <button type="submit" class="btn btn-primary" :disabled="!hasChanges">Spara</button>
        </div>
      </form>
    </div>
  </div>
</template>
