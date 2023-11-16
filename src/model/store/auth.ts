import { writable, derived } from "svelte/store";
import { Auth } from "@/model/Auth";

const auth = writable<Auth>(
  new Auth({
    name: "",
    photoUrl: "",
    email: "",
  }),
);

auth.subscribe(a => {
  console.log("auth", a); // @DELETEME
});

export const useAuth = () => {
  return {
    setAuth: auth.set,
    auth,
    /** Googleログイン済みであることを示す */
    isLoggedIn: derived(auth, $auth => $auth.isLoggedIn()),
    email: derived(auth, $auth => $auth.email),
  };
};
