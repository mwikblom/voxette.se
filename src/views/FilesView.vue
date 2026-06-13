<script setup lang="ts">
import FirebaseApi from "@/helpers/FirebaseApi";
import { computed, reactive, ref } from "vue";
import { RouteName } from "@/router";
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import type DocumentFile from "@/models/DocumentFile";
import AddFilesComponent from "@/components/AddFilesComponent.vue";
import Constants from "@/constants";

const files = ref<DocumentFile[]>([]);
const isLoading = ref(false);
const filters = reactive({
  name: "",
  type: Constants.NOTES,
  isCurrent: true,
  tag: "",
  category: "",
});

const searchIsDisabled = computed(
  () => isLoading.value || (!filters.name && !filters.type && !filters.isCurrent && !filters.category && !filters.tag),
);

function handleSetFiles(data: DocumentFile[]) {
  files.value = data ?? [];
  isLoading.value = false;
}

function handleSearchFiles() {
  if (searchIsDisabled.value) {
    return;
  }

  isLoading.value = true;
  FirebaseApi.fetchFiles(filters.name, filters.type, filters.isCurrent, filters.tag, filters.category, handleSetFiles);
}

function handleFilesAdded(added: DocumentFile) {
  files.value.unshift(added);
}

function getHumanFileSize(size: number) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  const fileSize = ((size / Math.pow(1024, i)) * 1).toFixed(2);
  const suffix = ["B", "kB", "MB", "GB", "TB"][i];
  return `${fileSize} ${suffix}`;
}
</script>

<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center">
      <h1>Filer</h1>
      <AddFilesComponent @added="handleFilesAdded" />
    </div>
    <div class="text-width">
      <p>
        Här kan du hitta noter, stämfiler och annat. Du kan söka genom att klicka på sökknappen; då listas samtliga
        filer som matchar sökkriterierna. Du kan även begränsa sökningen genom att ange första delen av filnamnet,
        exemelvis hittas DotterSion.pdf genom att ange "do". Det är också möjligt att begränsa sökningen genom att
        filtrera på en "typ", exempelvis noter och ljudfiler, kategori eller tagg. Är valet "Visa endast aktuella"
        markerad så kommer resultaten endast innehålla filer som är markerade som aktuella just nu.
      </p>
      <p>
        För att lägga till nya filer använder du den gröna knappen med plus. PDF-filer kommer automatiskt taggas som
        noter, audio-format såsom MP3 taggas som ljudfiler och bild-format som bilder. Övriga filtyper taggas som
        övrigt. När filen är uppladdad kan du klicka på pennan om du vill ändra filens namn eller övrig info.
      </p>
    </div>
    <form @submit.prevent="handleSearchFiles">
      <div class="row gy-4">
        <div class="col col-12 col-sm-6 col-md-3">
          <label for="name" class="form-label">Namn</label>
          <input id="name" type="text" class="form-control" v-model="filters.name" />
        </div>
        <div class="col col-12 col-sm-6 col-md-3">
          <label for="type" class="form-label">Typ</label>
          <select id="type" class="form-select" v-model="filters.type">
            <option value=""></option>
            <option v-for="type in Constants.FILE_TYPES" :value="type" :key="type">{{ type }}</option>
          </select>
        </div>
        <div class="col col-12 col-sm-6 col-md-3">
          <label for="category" class="form-label">Kategori</label>
          <select id="category" class="form-select" v-model="filters.category">
            <option value=""></option>
            <option v-for="category in Constants.FILE_CATEGORIES" :value="category" :key="category">
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col col-12 col-sm-6 col-md-3">
          <label for="tag" class="form-label">Tagg</label>
          <select id="tag" class="form-select" v-model="filters.tag">
            <option value=""></option>
            <optgroup v-for="tagGroup in Constants.FILE_TAGS" :key="tagGroup.name" :label="tagGroup.name">
              <option v-for="tag in tagGroup.tags" :key="tag" :value="tag">{{ tag }}</option>
            </optgroup>
          </select>
        </div>
        <div class="col col-8 col-sm-6">
          <input class="form-check-input me-3" type="checkbox" id="is-current" v-model="filters.isCurrent" />
          <label class="form-check-label" for="is-current">Visa endast aktuella</label>
        </div>
        <div class="col col-4 col-sm-6 d-flex justify-content-end">
          <button
            type="submit"
            class="btn btn-primary"
            aria-label="Sök efter filer"
            :disabled="searchIsDisabled || isLoading"
          >
            Sök
            <i class="bi bi-search" aria-hidden />
          </button>
        </div>
      </div>
    </form>
  </div>
  <SpinnerComponent v-if="isLoading" />
  <div v-else class="container-fluid">
    <div class="table-responsive">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Namn</th>
            <th>Filtyp</th>
            <th>Kategorier</th>
            <th>Taggar</th>
            <th>Aktuell</th>
            <th>Storlek</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in files" :key="file.fullPath">
            <td>
              <RouterLink
                :to="{ name: RouteName.DownloadFile, params: { fullPath: file.fullPath } }"
                target="_blank"
                rel="noreferrer"
                title="Öppna fil"
              >
                {{ file.name }}
              </RouterLink>
            </td>
            <td>{{ file.type }}</td>
            <td>
              <div class="d-flex flex-wrap gap-1">
                <span v-for="category in file.categories" class="badge text-bg-warning" :key="category">
                  {{ category }}
                </span>
              </div>
            </td>
            <td>
              <div class="d-flex flex-wrap gap-1">
                <span v-for="tag in file.tags" class="badge text-bg-danger" :key="tag">{{ tag }}</span>
              </div>
            </td>
            <td>
              <span v-if="file.isCurrent" class="badge text-bg-success">
                <i class="bi bi-check fs-5" aria-label="Aktuell" />
              </span>
            </td>
            <td>{{ getHumanFileSize(file.size) }}</td>
            <td class="btn-col">
              <RouterLink
                class="btn btn-outline-tertiary"
                :to="{ name: RouteName.File, params: { fullPath: file.fullPath } }"
                title="Redigera fil"
                aria-label="Redigera fil"
              >
                <i class="bi bi-pen" aria-hidden />
              </RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="css" scoped>
.btn-col {
  width: 2.5rem;
}
td {
  vertical-align: middle;
}
</style>
