<script setup lang="ts">
import ProfileIconComponent from "@/components/ProfileIconComponent.vue";
import FirebaseApi from "@/helpers/FirebaseApi";
import type { DisplayNameOrUserData, UserData } from "@/models/User";
import { computed, onBeforeMount, ref } from "vue";
import { RouteName } from "@/router";
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import AddMemberComponent from "@/components/AddMemberComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";

const members = ref<DisplayNameOrUserData[]>([]);
const isLoading = ref(false);
const name = ref("");
const tag = ref("");
const part = ref("");
const showAllergies = ref(false);

const allergyMembers = computed(() => members.value.filter((x) => !!x.allergies));

function handleSetMembers(data: unknown) {
  members.value = ((data as UserData[]) ?? []).map((x) => x.userData);
  isLoading.value = false;
}

onBeforeMount(() => {
  isLoading.value = true;
  FirebaseApi.fetchMembers(name.value, tag.value, part.value, handleSetMembers);
});
</script>

<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Medlemmar</h1>
      <AddMemberComponent />
    </div>
    <SpinnerComponent v-if="isLoading" />
    <div v-else class="d-flex flex-column">
      <button
        class="btn btn-outline-tertiary align-self-end"
        type="button"
        :disabled="!members.length"
        @click="showAllergies = true"
      >
        Lista allergier
      </button>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th></th>
              <th>Namn</th>
              <th>Stämma</th>
              <th>Taggar</th>
              <th>Telefon</th>
              <th>Epost</th>
              <th>Adress</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in members" :key="member.memberId">
              <td class="btn-col">
                <RouterLink
                  class="btn btn-outline-tertiary"
                  :to="{ name: RouteName.Member, params: { id: member.memberId } }"
                >
                  <i class="bi bi-pencil" aria-label="Redigera"></i>
                </RouterLink>
              </td>
              <td>
                <div class="gap-3 d-lg-flex align-items-center">
                  <ProfileIconComponent
                    :image="member.pictureUrl"
                    :first-name="member.firstName ?? ''"
                    :last-name="member.lastName ?? ''"
                  />
                  <span class="name">{{ member.firstName || "-" }} {{ member.lastName }}</span>
                </div>
              </td>
              <td>
                <span v-if="member.part" class="badge text-bg-danger">{{ member.part }}</span>
              </td>
              <td>
                <div class="d-flex flex-wrap gap-1">
                  <span v-for="tag in member.tags" class="badge text-bg-warning" :key="tag">{{ tag }}</span>
                </div>
              </td>
              <td>{{ member.phone }}</td>
              <td>{{ member.email }}</td>
              <td>{{ member.address }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <ModalComponent v-if="showAllergies" id="allergies-modal" title="Allergier" size="lg" @hide="showAllergies = false">
    <table>
      <tr v-for="member in allergyMembers" :key="member.memberId">
        <td class="h6 pe-3">{{ member.firstName }} {{ member.lastName }}</td>
        <td>{{ member.allergies }}</td>
      </tr>
    </table>
  </ModalComponent>
</template>

<style lang="css" scoped>
.btn-col {
  width: 2.5rem;
}
</style>
