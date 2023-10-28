import { writable } from "svelte/store";
import { Room } from "../Room";

const room = writable<Room>(
  new Room({
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
    subscribeRoom: room.subscribe,
    setRoom: room.set,
  };
};
