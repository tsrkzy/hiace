import { writable } from "svelte/store";
import { ImageSource } from "../ImageSource";
import { renewImageUrl, validateImageUrl } from "../service/ImageSourceService";

const imageSources = writable<ImageSource[]>([]);

imageSources.subscribe(imageSourceList => {
  console.log("imageSources.subscribe", imageSourceList); // @DELETEME
  for (let i = 0; i < imageSourceList.length; i++) {
    const imageSource = imageSourceList[i];
    validateImageUrl(imageSource.url).then(ok => {
      if (!ok) {
        console.log("image url is invalid", imageSource.url);
        renewImageUrl(imageSource.id).catch(e => console.error(e));
      } else {
        console.log("image url is valid", imageSource.url);
      }
    });
  }
});

export const useImageSources = () => {
  return {
    setImageSources: imageSources.set,
    imageSources,
  };
};
