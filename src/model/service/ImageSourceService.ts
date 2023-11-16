/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { ImageSource } from "@/model/ImageSource";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/util/firestore";
import { getImageMetaData, getImageSize } from "@/util/imageUtil";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

interface CreateImageSourceProps {
  roomId: string;
  userId: string;
  path: string;
  url: string;
  height: number;
  width: number;
  hidden?: boolean;
  tags?: string[];
}

export const createImageSource = async (props: CreateImageSourceProps) => {
  console.log("ImageSourceService.createImageSource");
  console.log(props);
  const {
    roomId,
    userId,
    path,
    url,
    height,
    width,
    hidden = true,
    tags = [],
  } = props;
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
  await setDoc(docRef, img);

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
};

/**
 * ImageSourceを削除することで、画像を論理削除する
 * @param imageId
 */
export const deleteImageSource = async (imageId: string): Promise<void> => {
  console.log("ImageSourceService.deleteImageSource", imageId);
  const collectionRef = collection(db, "image");
  const docRef = doc(collectionRef, imageId);
  await deleteDoc(docRef);
};

/**
 * 画像をfirebaseのstorageへアップロードし、
 * firestoreにImageSourceとして登録する
 * @param imageFile
 * @param roomId
 * @param userId
 */
export const registerImage = async (
  imageFile: File,
  roomId: string,
  userId: string,
) => {
  const { width, height } = await getImageSize(imageFile);

  const metaData = getImageMetaData(imageFile);
  const { name } = metaData;

  const fireStoragePath = `${userId}/images/${name}`;

  /* firebaseのstorageに画像をアップロードする */
  const url = await uploadImageToFirebaseStorage(
    imageFile,
    fireStoragePath,
    metaData,
  );

  /* firestoreにImageSourceを登録 */
  await createImageSource({
    roomId,
    userId,
    path: fireStoragePath,
    url,
    height,
    width,
  });
};

export const validateImageUrl = async (url: string) => {
  return await new Promise(resolve => {
    const $img = new Image();
    $img.onload = () => resolve(true);
    $img.onerror = () => resolve(false);
    $img.src = url;
  });
};

export const renewImageUrl = async (imageId: string) => {
  console.log("ImageSourceService.renewImageUrl");
  const collectionRef = collection(db, "image");
  const docRef = doc(collectionRef, imageId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  if (!data) {
    throw new Error(`image not found: ${imageId}`);
  }
  const { path } = data;
  const storageRef = ref(storage, path);
  const url = await getDownloadURL(storageRef);
  await updateDoc(docRef, { url });
  return url;
};

/**
 * firebaseのstorageに画像をアップロードする
 * @param {File} imageFile
 * @param {string} fireStoragePath
 * @param {{}} metaData
 */
const uploadImageToFirebaseStorage = async (
  imageFile: File,
  fireStoragePath: string,
  metaData: object,
): Promise<string> => {
  console.log("ImageSourceList.uploadImageToFirebaseStorage");
  return new Promise(resolve => {
    const storageRef = ref(storage, fireStoragePath);

    uploadBytes(storageRef, imageFile, metaData).then(() => {
      console.log("uploaded");
      getDownloadURL(storageRef).then(url => {
        console.log("url", url);
        resolve(url);
      });
    });
  });
};

interface updateImageSourceProps {
  imageSourceId: string;
  criteria: object;
}

export const updateImageSource = async (props: updateImageSourceProps) => {
  const { imageSourceId, criteria } = props;
  console.log("ImageSourceService.updateImageSource", imageSourceId, criteria);
  const collectionRef = collection(db, "image");
  const docRef = doc(collectionRef, imageSourceId);
  await updateDoc(docRef, criteria);
};

interface addTagImageSourceProps {
  imageSourceId: string;
  tag: string;
}

export const addTagImageSource = async (props: addTagImageSourceProps) => {
  const { imageSourceId, tag } = props;
  console.log("ImageSourceService.addTagImageSource", imageSourceId, tag);
  const collectionRef = collection(db, "image");
  const docRef = doc(collectionRef, imageSourceId);
  const snapShot = await getDoc(docRef);
  const imgSrc = snapShot.data() as ImageSource;

  if (imgSrc.tags.includes(tag)) {
    return;
  }
  imgSrc.tags.push(tag);

  await updateDoc(docRef, { tags: imgSrc.tags });
};

interface TagImageSource {
  imageSourceId: string;
  tag: string;
}

export const removeTagImageSource = async (props: TagImageSource) => {
  const { imageSourceId, tag } = props;
  console.log("ImageSourceService.removeTagImageSource", imageSourceId, tag);
  const collectionRef = collection(db, "image");
  const docRef = doc(collectionRef, imageSourceId);
  const snapShot = await getDoc(docRef);
  const imgSrc = snapShot.data() as ImageSource;

  if (!imgSrc.tags.includes(tag)) {
    return;
  }
  imgSrc.tags = imgSrc.tags.filter(t => t !== tag);

  await updateDoc(docRef, { tags: imgSrc.tags });
};
