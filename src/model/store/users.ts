import { derived, writable, get } from "svelte/store";
import { User } from "@/model/User";
import { useAuth } from "./auth";

const { email } = useAuth();
const users = writable<User[]>([]);

users.subscribe(a => {
  console.log("users.subscribe", a); // @DELETEME
});

const myUserId = derived(users, $users => {
  return ($users.find(u => u.email === get(email)) || {}).id || "";
});
const myName = derived(users, $users => {
  return ($users.find(u => u.email === get(email)) || {}).name || "";
});

export const useUsers = () => {
  return {
    setUsers: users.set,
    myUserId,
    myName,
    users,
  };
};
