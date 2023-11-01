import { get, writable } from "svelte/store";
import { ContentId, Float } from "../Float";

const floats = writable<Float[]>(
  [5, 1, 4, 2, 3].map(
    i =>
      new Float({
        id: i,
        show: true,
        contentId: ContentId.ROOM_MANAGER,
        contentTitle: `float_${i}`,
        x: 300,
        y: 300,
        w: 300,
        h: 300,
        z: i,
      }),
  ),
);

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
    subscribeFloats: floats.subscribe,
    setFloats: floats.set,
    floats,
    popFloat,
    closeFloat,
  };
};
