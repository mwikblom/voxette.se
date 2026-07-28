<script setup lang="ts">
import FirebaseApi from "@/helpers/FirebaseApi";
import { RouteName } from "@/router";
import { onBeforeMount, ref } from "vue";

const props = defineProps<{ fullPath: string }>();
const message = ref("Laddar fil...");

onBeforeMount(() => {
  if (!props.fullPath) {
    message.value = "Id till fil saknas";
    return;
  }

  FirebaseApi.getDownloadUrl(props.fullPath, (url) => {
    if (url) {
      window.location.href = url;
      return;
    }
    message.value = "Det gick inte att öppna filen";
  });
});
</script>

<template>
  <div class="container">
    <h1>{{ message }}</h1>
    <RouterLink :to="{ name: RouteName.Files }">Tillbaka till filer</RouterLink>
  </div>
</template>
