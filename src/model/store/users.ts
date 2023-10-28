import { writable } from "svelte/store";
import { User } from "../User";

const users = writable<User[]>([]);

users.subscribe(a => {
  console.log("users.subscribe", a); // @DELETEME
});

export const useUsers = () => {
  return {
    subscribeUsers: users.subscribe,
    setUsers: users.set,
  };
};
