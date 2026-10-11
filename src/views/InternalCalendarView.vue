<script setup lang="ts">
import AttendanceCheckComponent from "@/components/AttendanceCheckComponent.vue";
import AttendanceListComponent from "@/components/AttendanceListComponent.vue";
import EventInternalComponent from "@/components/EventInternalComponent.vue";
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import Constants from "@/constants";
import FirebaseApi from "@/helpers/FirebaseApi";
import type { CalendarEvent, MemberAttendance } from "@/models/Event";
import type { Event } from "@/models/Event";
import type { DisplayNameOrUserData } from "@/models/User";
import { useUserStore } from "@/stores/user";
import { onBeforeMount, ref, watch } from "vue";

const TODAY = new Date();

const userStore = useUserStore();

const fromDate = ref<Date>(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 1));
const toDate = ref<Date>();
const isLoading = ref(false);
const events = ref<Event[]>([]);
const showForm = ref(false);
const selectedEvent = ref<CalendarEvent>();
const members = ref<DisplayNameOrUserData[]>([]);
const selectedMember = ref<DisplayNameOrUserData | undefined>(userStore.user?.savedUserData);

function handleGetEvents() {
  FirebaseApi.fetchUpcomingEvents(true, fromDate.value, toDate.value, (data) => {
    events.value = sortEvents(data ?? []);
    isLoading.value = false;
  });
}

function sortEvents(events: Event[]) {
  return events.sort((a, b) => {
    const aDate = new Date(a.eventData.startDate);
    const bDate = new Date(b.eventData.startDate);
    const dateDiff = aDate.getTime() - bDate.getTime();

    return dateDiff !== 0 ? dateDiff : +a.eventData.startTime - +b.eventData.startTime;
  });
}

function handleAttendanceChange(eventId: string, memberId: string, attendance: MemberAttendance) {
  const event = events.value.find((x) => x.eventData.eventId === eventId);
  if (!event) {
    return;
  }
  const newEvents = [
    ...events.value.filter((x) => x.eventData.eventId !== eventId),
    {
      eventData: event.eventData,
      attendance: {
        ...event.attendance,
        [memberId]: attendance,
      },
    },
  ];

  events.value = sortEvents(newEvents);
}

onBeforeMount(() => {
  handleGetEvents();

  FirebaseApi.fetchMembers("", "", "", (allMembers) => {
    if (!allMembers) {
      return;
    }
    members.value = Object.values(allMembers).filter((x) => !x.tags || !x.tags.includes(Constants.INACTIVE));
  });
});

watch(fromDate, handleGetEvents, { immediate: false });
watch(toDate, handleGetEvents, { immediate: false });
</script>

<template>
  <div class="container">
    <div class="d-flex align-items-center">
      <div class="flex-grow-1">
        <h1>Intern kalender</h1>
        <p>Kommande evenemang med närvarokoll.</p>
      </div>
      <div>
        <button type="button" class="btn btn-tertiary" @click="showForm = true">
          <i class="bi bi-calendar-plus" aria-label="Lägg till evenemang"></i>
        </button>
      </div>
    </div>
    <form aria-label="Filtrera evenemang" class="row">
      <div class="col col-md-auto">
        <label for="fromDate" class="form-label" aria-label="Från datum">Från</label>
        <input v-model="fromDate" type="date" class="form-control" id="fromDate" />
      </div>
      <div class="col col-md-auto">
        <label for="toDate" class="form-label" aria-label="Till datum">Till</label>
        <input v-model="toDate" type="date" class="form-control" id="toDate" />
      </div>
      <div v-if="userStore.isAdmin && members" class="col col-md-auto align-self-end">
        <label for="selectedMember" class="form-label">Ange närvaro för</label>
        <select v-model="selectedMember" class="form-select" id="selectedMember">
          <option :value="userStore.user?.savedUserData">
            {{ userStore.userName }}
          </option>
          <option
            v-for="member in members.filter((x) => x.memberId !== userStore.user?.MemberId)"
            :value="member"
            :key="member.memberId"
          >
            {{ member.firstName }} {{ member.lastName }}
          </option>
        </select>
      </div>
    </form>
    <hr />
    <SpinnerComponent v-if="isLoading" />
    <div v-else-if="!events">
      <p>Inga evenemang hittades inom datumspannet.</p>
    </div>
    <div v-else>
      <div v-for="(event, index) in events" :key="`${event.eventData.title}${index}`" class="row">
        <EventInternalComponent
          :class="event.eventData.hasAttendanceCheck ? 'col-md-8' : 'col-12'"
          :calendar-event="event.eventData"
          @edit="selectedEvent = $event"
        />
        <template v-if="event.eventData.hasAttendanceCheck && !!selectedMember">
          <AttendanceCheckComponent
            class="col-md-4"
            :selected-member="selectedMember"
            :eventId="event.eventData.eventId"
            :attendance="event.attendance"
            @change="handleAttendanceChange"
          />
          <AttendanceListComponent class="col-12" :members="members" :attendance="event.attendance" />
        </template>
        <hr />
      </div>
    </div>
  </div>
</template>
