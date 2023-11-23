/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/util/firestore";
import { useSounds } from "@/model/store/sounds";
import { Sound } from "@/model/Sound";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function SoundListener() {
  const { setSounds } = useSounds();

  const setSoundListener = (roomId: string) => {
    console.log("setSoundListener");
    const q = query(collection(db, "sound"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const sounds: Sound[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const sound = new Sound({
          id: doc.id,
          name: d.name,
          room: d.room,
          owner: d.owner,
          path: d.path,
          url: d.url,
          hidden: d.hidden,
          duration: d.duration,
          loop: d.loop,
          tags: d.tags,
        });
        sounds.push(sound);
      });
      setSounds(sounds);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setSoundListener };
}
