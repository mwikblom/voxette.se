<script setup lang="ts">
import ProfileIconComponent from "@/components/ProfileIconComponent.vue";
import FirebaseApi from "@/helpers/FirebaseApi";
import type { DisplayNameOrUserData, UserData } from "@/models/User";
import { onBeforeMount, ref } from "vue";
import { RouteName } from "@/router";

const members = ref<DisplayNameOrUserData[]>([]);
const name = ref("");
const tag = ref("");
const part = ref("");

function handleSetMembers(data: unknown) {
  members.value = ((data as UserData[]) ?? []).map((x) => x.userData);
}

onBeforeMount(() => {
  FirebaseApi.fetchMembers(name.value, tag.value, part.value, handleSetMembers);
});
</script>

<template>
  <div class="container-fluid">
    <h1>Medlemmar</h1>
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
            <td>
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
                <span class="name">{{ member.firstName ?? "-" }} {{ member.lastName ?? "-" }}</span>
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
</template>
