/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { uploadFileToFirebaseStorage } from "@/model/service/FirebaseStorageService";
import { Sound } from "@/model/Sound";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/util/firestore";

export const registerSound = async (
  file: File,
  roomId: string,
  userId: string,
) => {
  console.log("SoundService.registerSound", file, roomId, userId);
  const duration = await getAudioDuration(file);

  const metaData = getSoundMetaData(file);
  const { name } = metaData;

  const fireStoragePath = `${userId}/sounds/${name}`;

  /* firebaseのstorageに音源をアップロードする */
  const url = await uploadFileToFirebaseStorage(
    file,
    fireStoragePath,
    metaData,
  );

  /* firestoreにSoundを登録 */
  await createSound({
    name,
    roomId,
    userId,
    path: fireStoragePath,
    url,
    duration,
  });
};

export const getSoundMetaData = (soundFile: File) => {
  const name = soundFile.name;
  const size = soundFile.size;
  const contentType = soundFile.type;
  return { name, size, contentType };
};

export const getAudioDuration = async (audio: File) => {
  const url = URL.createObjectURL(audio);

  return new Promise<number>((resolve, reject) => {
    const audio = new Audio(url);
    audio.preload = "metadata";
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
    audio.addEventListener("error", () => {
      reject();
    });
    audio.src = url;
  });
};

interface createSoundProps {
  name: string;
  roomId: string;
  userId: string;
  path: string;
  url: string;
  hidden?: boolean;
  duration: number;
  loop?: boolean;
  tags?: string[];
}

export const createSound = async (props: createSoundProps) => {
  console.log("SoundService.createSound", props);
  const {
    name,
    roomId,
    userId,
    path,
    url,
    hidden = false,
    duration,
    loop = false,
    tags = [],
  } = props;

  const s = {
    name,
    room: roomId,
    owner: userId,
    path,
    url,
    hidden,
    duration,
    loop,
    tags,
  };

  const collectionRef = collection(db, "sound");
  const docRef = doc(collectionRef);
  await setDoc(docRef, s);

  return new Sound({
    id: docRef.id,
    name: s.name,
    room: s.room,
    owner: s.owner,
    path: s.path,
    url: s.url,
    hidden: s.hidden,
    duration: s.duration,
    loop: s.loop,
    tags: s.tags,
  });
};

interface updateSoundProps {
  soundId: string;
  criteria: Partial<createSoundProps>;
}
export const updateSound = async (props: updateSoundProps) => {
  const { soundId, criteria } = props;
  const collectionRef = collection(db, "sound");
  const docDef = doc(collectionRef, soundId);
  await updateDoc(docDef, criteria);
}