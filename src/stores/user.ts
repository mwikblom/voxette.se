import { computed, ref } from "vue";
import { defineStore } from "pinia";
import type User from "@/models/User";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | undefined>();

  const isLoggedIn = computed(() => !!user.value);

  function setUser(user?: User) {
    user = user;
  }

  return {
    isLoggedIn,
    user,
    setUser,
  };
});
