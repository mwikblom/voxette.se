<script setup lang="ts">
import { useTemplateRef } from "vue";
import FirebaseApi from "@/helpers/FirebaseApi";
import type DocumentFile from "@/models/DocumentFile";

const emit = defineEmits<{ added: [DocumentFile] }>();

const inputRef = useTemplateRef("input");

function handleSubmit() {
  const files = inputRef.value?.files ?? [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file) {
      continue;
    }

    const fullPath = `${new Date().getTime()}_${file.name}`;
    FirebaseApi.uploadFile(fullPath, file, (data) => emit("added", data));
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input type="file" ref="input" accept="*/*" class="input" id="upload-input" multiple @change="handleSubmit" />
    <label for="upload-input" class="btn btn-outline-primary" aria-label="Lägg till filer">
      <i class="bi bi-plus" aria-hidden />
    </label>
  </form>
</template>

<style lang="scss" scoped>
.input {
  display: none;
}
</style>
