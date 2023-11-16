/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/util/firestore";
import { useImageSources } from "@/model/store/imageSources";
import { ImageSource } from "@/model/ImageSource";

const subscribeMap = new Map<
  string,
  { id: string; unsubscribe: () => unknown }
>();

export function ImageSourceListener() {
  const { setImageSources } = useImageSources();

  const setImageSourceListener = (roomId: string) => {
    console.log("setImageSourceListener");
    const q = query(collection(db, "image"), where("room", "==", roomId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const imageSources: ImageSource[] = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const image = new ImageSource({
          id: doc.id,
          room: d.room,
          owner: d.owner,
          path: d.path,
          url: d.url,
          height: d.height,
          width: d.width,
          hidden: d.hidden,
          tags: d.tags,
        });
        imageSources.push(image);
      });
      setImageSources(imageSources);
    });

    subscribeMap.set(roomId, { id: roomId, unsubscribe });
  };

  return { setImageSourceListener };
}
