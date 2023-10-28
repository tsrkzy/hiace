import { writable } from "svelte/store";
import { MapChip } from "../Map";

const mapChips = writable<MapChip[]>([]);

mapChips.subscribe(a => {
  console.log("mapChips.subscribe", a); // @DELETEME
});

export const useMapChips = () => {
  return {
    subscribeMapChips: mapChips.subscribe,
    setMapChips: mapChips.set,
  };
};
