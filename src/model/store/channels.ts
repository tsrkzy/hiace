import { writable } from "svelte/store";
import { Channel } from "../Channel";

const channels = writable<Channel[]>([]);

channels.subscribe(a => {
  console.log("channels.subscribe", a); // @DELETEME
});

export const useChannels = () => {
  return {
    subscribeChannels: channels.subscribe,
    setChannels: channels.set,
  };
};
