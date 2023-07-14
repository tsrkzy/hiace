import { writable } from "svelte/store";
import { Auth } from "../model/Auth";

const auth = writable<Auth>({});

auth.subscribe((a) => {
  console.log("auth", a); // @DELETEME
})

export const useAuth = () => {
  return {
    subscribe: auth.subscribe,
    setAuth: auth.set
  }
}