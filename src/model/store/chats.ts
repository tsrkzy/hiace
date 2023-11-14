import { tick } from "svelte";
import { writable } from "svelte/store";
import { Chat } from "../Chat";
import { scrollChatToBottom } from "../service/ChatService";

const chats = writable<Chat[]>([]);

chats.subscribe(a => {
  // console.log("chats.subscribe", a); // @DELETEME
  console.log("chats: ", a.length);
  tick().then(() => scrollChatToBottom());
});


export const useChats = () => {
  return {
    setChats: chats.set,
    chats,
  };
};
