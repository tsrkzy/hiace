import { writable } from "svelte/store";
import { RoomStore } from "../model/store/RoomStore";

const room = writable<RoomStore>(
  new RoomStore({
    id: "",
    name: "",
    owner: "",
    keepers: [],
    requests: [],
    kicked: [],
    users: [],
    gameSystem: "",
    music: "",
  }),
);

room.subscribe(a => {
  console.log("room.subscribe", a); // @DELETEME
});

export const useRoom = () => {
  return {
    subscribe: room.subscribe,
    setRoom: room.set,
  };
};
