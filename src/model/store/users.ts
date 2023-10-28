import { derived, writable, get } from "svelte/store";
import { User } from "../User";
import { useAuth } from "./auth";

const { email } = useAuth();
const users = writable<User[]>([]);

users.subscribe(a => {
  console.log("users.subscribe", a); // @DELETEME
});

const myUserId = derived(users, $users => {
  return ($users.find(u => u.email === get(email)) || {}).id || "";
});

export const useUsers = () => {
  return {
    subscribeUsers: users.subscribe,
    setUsers: users.set,
    myUserId,
  };
};
