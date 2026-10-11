<script lang="ts" setup>
import DateTimeHelper from "@/helpers/DateTimeHelper";
import FirebaseApi from "@/helpers/FirebaseApi";
import type { Attendance, MemberAttendance } from "@/models/Event";
import type { DisplayNameOrUserData } from "@/models/User";
import { useUserStore } from "@/stores/user";
import { computed, ref } from "vue";

const props = defineProps<{
  selectedMember: DisplayNameOrUserData;
  eventId: string;
  attendance: Attendance;
  class?: string;
}>();
const emit = defineEmits<{ change: [string, string, MemberAttendance] }>();

const userStore = useUserStore();

const memberAttendance = computed(() =>
  props.selectedMember.memberId ? props.attendance[props.selectedMember.memberId] : undefined,
);

const currentAttendance = ref(parseChoice(memberAttendance.value?.choice));

function parseChoice(value?: string | number): number {
  switch (value) {
    case "0":
    case 0:
      return 0;
    case "1":
    case 1:
      return 1;
    default:
      return -1;
  }
}

function handleSaveAttendance(e: Event) {
  const choice = (e.target as HTMLInputElement | null)?.value;

  const memberId = props.selectedMember.memberId;
  if (!memberId) {
    return;
  }

  const attendance: MemberAttendance = {
    choice,
    part: props.selectedMember.part,
    updated: DateTimeHelper.getCurrentTimestamp(),
  };

  FirebaseApi.addEventAttendance(props.eventId, memberId, attendance, () => {
    emit("change", props.eventId, memberId, attendance);
  });
}
</script>

<template>
  <div :class="props.class">
    <h3 v-if="selectedMember.memberId === userStore.user?.MemberId">Min närvaro</h3>
    <h3 v-else>Närvaro för {{ selectedMember.firstName }} {{ selectedMember.lastName }}</h3>
    <div class="row">
      <div class="col-6">
        <div class="form-check">
          <input
            v-model="currentAttendance"
            class="form-check-input yes"
            type="radio"
            :name="`${eventId}-choice`"
            id="`${eventId}-choice-yes`"
            :value="1"
            @change="handleSaveAttendance"
          />
          <label class="form-check-label" :for="`${eventId}-choice-yes`">Ja</label>
        </div>
      </div>
      <div class="col-6">
        <div class="form-check">
          <input
            v-model="currentAttendance"
            class="form-check-input no"
            type="radio"
            :name="`${eventId}-choice`"
            id="`${eventId}-choice-no`"
            :value="0"
            @change="handleSaveAttendance"
          />
          <label class="form-check-label" :for="`${eventId}-choice-no`">Nej</label>
        </div>
      </div>
    </div>
    <p>Senast ändrad: {{ memberAttendance?.updated }}</p>
  </div>
</template>

<style lang="css" scoped>
.yes:checked {
  color: var(--bs-success);
}
.no:checked {
  color: var(--bs-danger);
}
</style>
