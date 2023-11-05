import { get, writable } from "svelte/store";
import { ContentId, Float } from "../Float";

const floats = writable<Float[]>([
  new Float({
    id: 1,
    show: true,
    contentId: ContentId.ROOM_MANAGER,
    contentTitle: "float_1",
    x: 300,
    y: 300,
    w: 300,
    h: 300,
    z: 1,
  }),
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
]);

floats.subscribe(a => {
  console.log("floats.subscribe", a); // @DELETEME
});

const popFloat = (floatId: number) => {
  const floatList = get(floats);
  const maxZ = floatList.length;

  /* zの降順かつ対象を最前列に */
  floatList.sort((a, b) =>
    a.id === floatId ? -1 : b.id === floatId ? 1 : a.z < b.z ? 1 : -1,
  );

  for (let i = 0; i < floatList.length; i++) {
    const f = floatList[i];
    f.z = maxZ - i;
  }

  floats.set(floatList);
};

const closeFloat = (floatId: number) => {
  const floatList = get(floats);
  floats.set(floatList.filter(f => f.id !== floatId));
};

export const useFloats = () => {
  return {
    setFloats: floats.set,
    floats,
    popFloat,
    closeFloat,
  };
};
