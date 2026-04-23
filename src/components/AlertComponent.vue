<script lang="ts">
export enum AlertStatus {
  Primary = "alert-primary",
  Secondary = "alert-secondary",
  Success = "alert-success",
  Error = "alert-danger",
  Warning = "alert-warning",
  Info = "alert-info",
  Light = "alert-light",
  Dark = "alert-dark",
}
</script>
<script setup lang="ts">
import { Alert } from "bootstrap";
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";

const props = defineProps<{
  status: AlertStatus;
  autoHideMs?: number;
}>();
const emit = defineEmits<{ hide: [] }>();

const alertRef = useTemplateRef("alertRef");
const alert = ref<Alert>();
const timeout = ref<ReturnType<typeof setTimeout>>();

const accessibleStatus = computed(() => {
  switch (props.status) {
    case AlertStatus.Primary:
      return "";
    case AlertStatus.Secondary:
      return "";
    case AlertStatus.Success:
      return "Succé";
    case AlertStatus.Error:
      return "Error";
    case AlertStatus.Warning:
      return "Varning";
    case AlertStatus.Info:
      return "Info";
    case AlertStatus.Light:
      return "";
    case AlertStatus.Dark:
      return "";
    default:
      return "";
  }
});

function handleClose() {
  emit("hide");
}

onMounted(() => {
  if (alertRef.value) {
    alert.value = new Alert(alertRef.value);

    alertRef.value.addEventListener("close.bs.alert", handleClose);

    if (props.autoHideMs) {
      timeout.value = setTimeout(() => {
        handleClose();
      }, props.autoHideMs);
    }
  }
});

onBeforeUnmount(() => {
  clearTimeout(timeout.value);

  if (alertRef.value) {
    alertRef.value.removeEventListener("close.bs.alert", handleClose);

    alert.value?.dispose();
  }
});
</script>

<template>
  <Teleport to="#alerts">
    <div ref="alertRef" :class="['alert', status]" role="alert">
      <span v-if="accessibleStatus" class="visually-hidden">{{ accessibleStatus }}:</span>
      <span class="content">
        <slot />
      </span>
      <button type="button" class="btn-close" aria-label="Stäng" @click="handleClose"></button>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.alert {
  max-width: 25rem;
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}

.content {
  margin-right: 1rem;
}
</style>
