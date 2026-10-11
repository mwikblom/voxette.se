<script lang="ts" setup>
import type { Attendance } from "@/models/Event";
import type { DisplayNameOrUserData } from "@/models/User";

const props = defineProps<{
  members: DisplayNameOrUserData[];
  attendance: Attendance;
  class?: string;
}>();

function parseChoice(value?: string): number {
  switch (value) {
    case "0":
      return 0;
    case "1":
      return 1;
    default:
      return -1;
  }
}
</script>

<template>
  <div :class="props.class"></div>
</template>
