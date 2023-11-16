import { writable } from "svelte/store";
import { Chat } from "@/model/Chat";

const chats = writable<Chat[]>([]);

chats.subscribe(a => {
  // console.log("chats.subscribe", a); // @DELETEME
  console.log("chats: ", a.length);
});

export const useChats = () => {
  return {
    setChats: chats.set,
    chats,
  };
};
