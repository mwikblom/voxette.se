<script lang="ts" setup>
import { replaceLinebreaks, sanitizeHTML } from "@/helpers/StringHelper";
import type { CalendarEvent } from "@/models/Event";
import { computed, ref } from "vue";

const PREVIEW_LENGTH = 110;

const props = defineProps<{ calendarEvent: CalendarEvent; class?: string }>();
const emit = defineEmits<{ edit: [CalendarEvent] }>();

const expanded = ref(false);
const shouldExpand = computed(() => props.calendarEvent.description.length > PREVIEW_LENGTH + 3);
const previewDescription = computed(() =>
  shouldExpand.value
    ? `${props.calendarEvent.description.substring(0, PREVIEW_LENGTH)}...`
    : props.calendarEvent.description,
);

const eventDate = computed(() => {
  let dateString = `${props.calendarEvent.startDate} kl: ${props.calendarEvent.startTime} - `;
  if (props.calendarEvent.startDate === props.calendarEvent.endDate) {
    dateString += props.calendarEvent.endTime;
  } else {
    dateString += `${props.calendarEvent.endDate} kl: ${props.calendarEvent.endTime}`;
  }
  return dateString;
});
</script>

<template>
  <div :class="props.class">
    <div class="d-flex gap-3 justify-content-between">
      <h2>{{ calendarEvent.title }}</h2>
      <button type="button" class="btn btn-tertiary" @click="emit('edit', calendarEvent)">
        <i class="bi bi-pencil" aria-label="Redigera"></i>
      </button>
    </div>
    <p class="caption-top">
      {{ eventDate }}
      <span v-if="calendarEvent.meetupTime"> (Samling kl: {{ calendarEvent.meetupTime }}) </span>
    </p>
    <p>Plats: {{ calendarEvent.location }}</p>
    <p
      v-html="sanitizeHTML(replaceLinebreaks(expanded ? calendarEvent.description : previewDescription))"
      aria-label="calendarEvent.description"
    />
    <button v-if="shouldExpand" class="btn btn-outline-primary mb-4" aria-hidden="true" @click="expanded = !expanded">
      <i :class="['bi', expanded ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
    </button>
  </div>
</template>
