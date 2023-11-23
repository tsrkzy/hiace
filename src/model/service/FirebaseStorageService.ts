/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/util/firestore";

interface FileMetaData {
  name: string;
  size: number;
  contentType: string;
}

/**
 * firebaseのstorageにファイルをアップロードする
 * @param {File} imageFile
 * @param {string} fireStoragePath
 * @param {FileMetaData} metaData
 */
export const uploadFileToFirebaseStorage = async (
  imageFile: File,
  fireStoragePath: string,
  metaData: FileMetaData,
): Promise<string> => {
  console.log("ImageSourceList.uploadFileToFirebaseStorage");
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
