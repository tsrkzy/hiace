import { writable } from "svelte/store";
import { MapChip } from "../MapChip";

const mapChips = writable<MapChip[]>([]);

mapChips.subscribe(a => {
  console.log("mapChips.subscribe", a); // @DELETEME
});

const draggedMapChipId = writable<string>("");

export const useMapChips = () => {
  return {
    setMapChips: mapChips.set,
    mapChips,
    draggedMapChipId,
    setDraggedMapChipId: draggedMapChipId.set,
  };
};
