/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/


import { ImageSource } from "../ImageSource";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../util/firestore";

interface CreateImageSourceProps {
  roomId: string;
  userId: string;
  path: string;
  url: string;
  height: number;
  width: number;
  hidden: boolean;
  tags: string[];
}

export const createImageSource = async (props: CreateImageSourceProps) => {
  console.log("ImageSourceService.createImageSource");
  console.log(props);
  const { roomId, userId, path, url, height, width, hidden = true, tags = [] } = props;
  const img = {
    room: roomId,
    owner: userId,
    path,
    url,
    height,
    width,
    hidden,
    tags,
  };

  const collectionRef = collection(db, "image");
  const docRef = doc(collectionRef);
  await setDoc(docRef, img)

  return new ImageSource({
    id: docRef.id,
    room: img.room,
    owner: img.owner,
    path: img.path,
    url: img.url,
    height: img.height,
    width: img.width,
    hidden: img.hidden,
    tags: img.tags,

  });
}