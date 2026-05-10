<script setup lang="ts">
import { Modal } from "bootstrap";
import { onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from "vue";

const isOpen = defineModel<boolean>("is-open", { default: true });
defineProps<{
  id: string;
  title: string;
  noCancelButton?: boolean;
  size?: "sm" | "lg" | "xl";
}>();
const emit = defineEmits<{ show: []; hide: [] }>();

const modalRef = useTemplateRef("modalRef");
const modal = ref<Modal>();

function handleShow() {
  isOpen.value = true;
  emit("show");
}

function handleHide() {
  isOpen.value = false;
  emit("hide");
}

watch(isOpen, (isOpen) => {
  if (isOpen) {
    modal.value?.show();
  } else {
    document.querySelector("a")?.focus();
    modal.value?.hide();
  }
});

onMounted(() => {
  if (modalRef.value) {
    modal.value = new Modal(modalRef.value);
    if (isOpen.value) {
      modal.value.show();
    }

    modalRef.value.addEventListener("show.bs.modal", handleShow);
    modalRef.value.addEventListener("hide.bs.modal", handleHide);
  }
});

onBeforeUnmount(() => {
  if (modalRef.value) {
    modalRef.value.removeEventListener("show.bs.modal", handleShow);
    modalRef.value.removeEventListener("hide.bs.modal", handleHide);

    modal.value?.dispose();
  }
});
</script>

<template>
  <Teleport to="#modals">
    <div :id ref="modalRef" class="modal" tabindex="-1" :aria-labelledby="`${id}-title`">
      <div :class="['modal-dialog', { [`modal-${size}`]: !!size }]">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" :id="`${id}-title`">{{ title }}</h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer">
            <button v-if="!noCancelButton" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Avbryt
            </button>
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
