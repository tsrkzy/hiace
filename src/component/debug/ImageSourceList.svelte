<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useRoom } from "../../model/store/room";
  import { useImageSources } from "../../model/store/imageSources";
  import { createImageSource } from "../../model/service/ImageSourceService";
  import Button from "../button/Button.svelte";
  import { useUsers } from "../../model/store/users";
  import { getImageSize } from "../../util/imageUtil";

  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { storage } from "../../util/firestore";

  export let open = false;

  const { room } = useRoom();
  const { myUserId } = useUsers()
  const { imageSources } = useImageSources()


  const onClickUploadImages = () => {
    console.log("ImageSourceList.onClickUploadImages");
    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.accept = "image/*";
    inputEl.multiple = true;
    inputEl.addEventListener("change", async (e) => {
      console.log(">>>>>>>>");
      const { files = [] } = e.target;
      for (let i = 0; i < files.length; i++) {
        const imageFile = files[i];
        const { width, height } = await getImageSize(imageFile);
        const name = imageFile.name
        const size = imageFile.size
        const contentType = imageFile.type
        const roomId = $room.id
        const userId = $myUserId;
        const fireStoragePath = `${userId}/images/${name}`;

        console.log(name, size, contentType, roomId, userId, fireStoragePath)

        const metaData = { name, size, contentType };
        const url = await uploadImageToFirebaseStorage(imageFile, fireStoragePath, metaData);

        await createImageSource({ roomId, userId, path: fireStoragePath, url, height, width });
      }

    }, false);
    inputEl.click();
  }

  const uploadImageToFirebaseStorage = async (imageFile, fireStoragePath, metaData) => {
    console.log("ImageSourceList.uploadImageToFirebaseStorage");
    return new Promise(resolve => {
      const storageRef = ref(storage, fireStoragePath);

      uploadBytes(storageRef, imageFile, metaData).then(() => {
        console.log("uploaded");
        getDownloadURL(storageRef).then(url => {
          console.log("url", url);
          resolve(url);
        })
      })

    })
  }
</script>

<main>
  <details {open}>
    <summary>ImageSources</summary>
    <ul>
      {#each $imageSources as imgSrc}
        <li><img src={imgSrc.url} alt={imgSrc.id}></li>
      {/each}
    </ul>
    <Button handle={()=>onClickUploadImages()}>Image Upload</Button>
  </details>
</main>