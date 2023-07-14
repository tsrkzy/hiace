import { writable } from "svelte/store";

export const auth = writable({
  /* firestore.auth */
  auth: {
    name: null,
    photoUrl: null,
    email: null,
  },
  /* firestore.user */
  user: {
    id: null,
    name: null,
    photoUrl: null,
    email: null,
  },
});

auth.subscribe((a) => {
  console.log("auth", a); // @DELETEME
})