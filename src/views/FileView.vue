<script setup lang="ts">
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import FirebaseApi from "@/helpers/FirebaseApi";
import { clone, isDirty } from "@/helpers/ObjectHelper";
import { computed, onBeforeMount, ref } from "vue";
import Constants from "@/constants";
import { RouteName } from "@/router";
import DocumentFile from "@/models/DocumentFile";
import { useRouter } from "vue-router";
import { getHumanFileSize } from "@/helpers/FileHelper";
import ModalComponent from "@/components/ModalComponent.vue";

const props = defineProps<{ fullPath: string }>();

const router = useRouter();

const isLoading = ref(true);
const initialFile = ref<DocumentFile>();
const file = ref<DocumentFile>();
const showDeleteModal = ref(false);
const hasChanges = computed(() => initialFile.value && file.value && isDirty(initialFile.value, file.value));

function handleSubmit() {
  if (!hasChanges.value || !file.value) {
    return;
  }

  FirebaseApi.saveFileData(
    props.fullPath,
    file.value.name,
    file.value.fileType,
    file.value.isCurrent,
    file.value.tags,
    file.value.categories,
    () => {
      initialFile.value = file.value;
    },
  );
}

function handleDelete() {
  FirebaseApi.deleteFile(props.fullPath, () => router.go(-1));
}

onBeforeMount(() => {
  if (!props.fullPath) {
    isLoading.value = false;
    return;
  }

  FirebaseApi.fetchFileData(props.fullPath, (fileData) => {
    isLoading.value = false;
    if (!fileData) {
      return;
    }

    if (!fileData.tags) {
      fileData.tags = [];
    }
    if (!fileData.categories) {
      fileData.categories = [];
    }

    file.value = clone(fileData);
    initialFile.value = fileData;

    document.title = `${initialFile.value.name} - ${document.title}`;
  });
});
</script>

<template>
  <div class="container">
    <RouterLink :to="{ name: RouteName.Files }" @click.prevent="router.go(-1)" class="d-block pt-3">
      <i aria-hidden class="bi bi-chevron-left" />
      Tillbaka
    </RouterLink>
    <h1>Fil</h1>
    <SpinnerComponent v-if="isLoading" />
    <p v-else-if="!file" class="text-danger">Fil kunde inte hämtas.</p>
    <div v-else>
      <form autocomplete="off" @submit.prevent="handleSubmit">
        <div class="row">
          <div class="col col-12 col-sm-6">
            <div class="mb-3">
              <label for="name" class="form-label">Namn</label>
              <input v-model="file.name" type="text" class="form-control" id="name" required />
            </div>
          </div>
          <div class="col col-12 col-sm-6">
            <div class="mb-3">
              <label for="fileType" class="form-label">Typ</label>
              <select v-model="file.fileType" class="form-select" id="fileType">
                <option v-for="fileType in Constants.FILE_TYPES" :value="fileType" :key="fileType">
                  {{ fileType }}
                </option>
              </select>
            </div>
          </div>
          <div class="col col-12 col-sm-6">
            <div class="mb-3">
              <label for="categories" class="form-label">Kategorier</label>
              <select v-model="file.categories" class="form-select" id="categories" multiple>
                <option v-for="category in Constants.FILE_CATEGORIES" :value="category" :key="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>
          <div class="col col-12 col-sm-6">
            <div class="mb-3">
              <label for="tags" class="form-label">Taggar</label>
              <select v-model="file.tags" class="form-select" id="tags" multiple>
                <optgroup v-for="tagGroup in Constants.FILE_TAGS" :key="tagGroup.name">
                  <option v-for="tag in tagGroup.tags" :value="tag" :key="tag">
                    {{ tag }}
                  </option>
                </optgroup>
              </select>
            </div>
          </div>
          <div class="col col-sm-12 col-md-3">
            <div class="mb-3 form-check">
              <input type="checkbox" id="isCurrent" v-model="file.isCurrent" class="form-check-input" />
              <label for="isCurrent" class="form-check-label">Aktuell</label>
            </div>
          </div>
          <div class="col col-12 col-sm-6 col-md-3">
            <div class="mb-3">
              <label for="size" class="form-label">Storlek</label>
              <input type="text" class="form-control" id="size" :value="getHumanFileSize(file.size)" disabled />
            </div>
          </div>
          <div class="col col-12 col-sm-6">
            <div class="mb-3">
              <label for="type" class="form-label">Typ</label>
              <input type="text" class="form-control" id="type" :value="file.type" disabled />
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-end gap-3">
          <RouterLink :to="{ name: RouteName.Files }" @click.prevent="router.go(-1)" class="btn btn-secondary">
            Avbryt
          </RouterLink>
          <button type="submit" class="btn btn-primary" :disabled="!hasChanges">Spara</button>
          <button type="button" class="btn btn-danger" @click="showDeleteModal = true">Ta bort</button>
        </div>
      </form>
    </div>
  </div>
  <ModalComponent id="delete-file-modal" title="Ta bort fil" v-model:is-open="showDeleteModal">
    <p>Är du säker på att du vill ta bort filen {{ file?.name }}?</p>
    <strong>OBS: Detta går inte att ångra.</strong>
    <template #footer>
      <button type="button" class="btn btn-danger" @click="handleDelete">Ta bort</button>
    </template>
  </ModalComponent>
</template>
