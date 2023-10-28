/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../util/firestore";
import { useMapChips } from "../store/mapChips";
import { MapChip } from "../Map";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function MapChipListener() {
  const { setMapChips } = useMapChips();

  const setMapChipListener = (roomId: string) => {
    console.log("setMapChipListener");
    const q = query(collection(db, "map"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const mapChips: MapChip[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const mapChip = new MapChip({
          id: doc.id,
          name: d.name,
        });
        mapChips.push(mapChip);
      });
      setMapChips(mapChips);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setMapChipListener };
}
