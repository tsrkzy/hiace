/*-----------------------------------------------------------------------------
 - Copyright (c) 2023.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const getImageSize = (imageFile: File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject();
    };
    img.src = URL.createObjectURL(imageFile);
  });
};

interface getFileMetaDataResult {
  name: string;
  size: number;
  contentType: string;
}

export const getFileMetaData = (file: File): getFileMetaDataResult => {
  const name = file.name;
  const size = file.size;
  const contentType = file.type;
  return { name, size, contentType };
};

export const getDefaultPawnObjectURL = async () => {
  const response = await fetch("/default_pawn.png");
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
export const getDefaultMapObjectURL = async () => {
  const response = await fetch("/default_map.png");
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
