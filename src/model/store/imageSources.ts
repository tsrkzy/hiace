import { writable } from "svelte/store";
import { ImageSource } from "../ImageSource";

const imageSources = writable<ImageSource[]>([]);

imageSources.subscribe(a => {
  console.log("imageSources.subscribe", a); // @DELETEME
});

export const useImageSources = () => {
  return {
    setImageSources: imageSources.set,
    imageSources,
  };
};
