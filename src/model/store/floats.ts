import { writable } from "svelte/store";
import { ContentId, Float } from "../Float";

const floats = writable<Float[]>([
  // new Float({
  //   id: 1,
  //   show: true,
  //   contentId: ContentId.ROOM_MANAGER,
  //   contentTitle: "float_1",
  //   x: 300,
  //   y: 300,
  //   w: 300,
  //   h: 300,
  //   z: 1,
  // }),
  new Float({
    id: 2,
    show: true,
    contentId: ContentId.BOARD_MANAGER,
    contentTitle: "float_2",
    x: 300,
    y: 300,
    w: 300,
    h: 300,
    z: 2,
  }),
  new Float({
    id: 3,
    show: true,
    contentId: ContentId.CHARACTER_MANAGER,
    contentTitle: "float_3",
    x: 300,
    y: 300,
    w: 300,
    h: 300,
    z: 3,
  }),
]);

floats.subscribe(a => {
  console.log("floats.subscribe", a); // @DELETEME
});

export const useFloats = () => {
  return {
    setFloats: floats.set,
    floats,
  };
};
