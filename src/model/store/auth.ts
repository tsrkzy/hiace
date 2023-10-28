import { writable, derived } from "svelte/store";
import { Auth } from "../Auth";

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
    subscribeAuth: auth.subscribe,
    setAuth: auth.set,
    /** Googleログイン済みであることを示す */
    isLoggedIn: derived(auth, $auth => $auth.isLoggedIn()),
    email: derived(auth, $auth => $auth.email),
  };
};
