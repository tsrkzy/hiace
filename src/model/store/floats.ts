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
  const targetFloat = floatList.find(f => f.id === floatId) as Float;
  const zThreshold = targetFloat.z;

  floatList.forEach((f: Float) => {
    if (f.id === floatId) {
      f.z = maxZ;
    } else if (f.z > zThreshold) {
      f.z = f.z - 1;
    }
  });
  floats.set(floatList);
};

export const useFloats = () => {
  return {
    subscribeFloats: floats.subscribe,
    setFloats: floats.set,
    floats,
    popFloat,
  };
};
