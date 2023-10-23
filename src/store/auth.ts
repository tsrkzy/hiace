import { writable, derived } from "svelte/store";
import { Auth } from "../model/Auth";

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
    authorized: derived(auth, $auth => $auth.LoggedIn),
    name: derived(auth, $auth => $auth.Name),
  };
};
