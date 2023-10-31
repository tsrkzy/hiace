import { writable } from "svelte/store";
import { ContentId, Float } from "../Float";

const floats = writable<Float[]>([
  new Float({
    id: 1,
    show: true,
    contentId: ContentId.CHAT_LIST,
    contentTitle: "test1111111",
    x: 300,
    y: 300,
    w: 300,
    h: 300,
    z: 1,
  }),
]);

floats.subscribe(a => {
  console.log("floats.subscribe", a); // @DELETEME
});

export const useFloats = () => {
  return {
    subscribeFloats: floats.subscribe,
    setFloats: floats.set,
    floats,
  };
};
