import { computed, ref } from "vue";
import { defineStore } from "pinia";
import User from "@/models/User";
import { type User as FirebaseUser } from "firebase/auth";
import FirebaseApi from "@/helpers/FirebaseApi";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | undefined>();
  const newPicture = ref<string>();

  const isLoggedIn = computed(() => !!user.value);
  const hasNewPicture = computed(() => isLoggedIn.value && user.value?.Picture !== newPicture.value);

  function setUser(value?: User) {
    user.value = value;
  }

  function setNewPicture(value?: string) {
    newPicture.value = value;
  }

  function setLoginSuccess(firebaseUser: FirebaseUser, callback: (success: boolean, message: string) => void) {
    if (!firebaseUser.email) {
      throw new Error("User email is required.");
    }

    FirebaseApi.fetchUserData(firebaseUser.email, (userData) => {
      if (!userData) {
        setUser(undefined);
        callback(false, `Hoppsan! Användare ${firebaseUser.email} saknas.`);
        return;
      }

      if (userData.googleId) {
        const member = new User(firebaseUser.uid, userData, firebaseUser.email!, userData.pictureUrl);
        setUser(member);
        setNewPicture(firebaseUser.photoURL ?? undefined);
        callback(true, "Du är nu inloggad!");
        return;
      }

      // First login - generate the user data
      const newUser = new User(firebaseUser.uid, firebaseUser.displayName, firebaseUser.email, firebaseUser.photoURL);
      const initialUserData = newUser.InitialUserData;

      FirebaseApi.saveUserData(userData.memberId!, initialUserData, () => {
        setUser(newUser);
        callback(true, `Skapade användare för ${newUser.FirstName}`);
        return;
      });
    });
  }

  return {
    isLoggedIn,
    newPicture,
    hasNewPicture,
    setNewPicture,
    user,
    setUser,
    setLoginSuccess,
  };
});
