import { writable } from "svelte/store";
import { Chat } from "../Chat";

const chats = writable<Chat[]>([]);

chats.subscribe(a => {
  console.log("chats.subscribe", a); // @DELETEME
});

export const useChats = () => {
  return {
    subscribeChats: chats.subscribe,
    setChats: chats.set,
    chats,
  };
};
