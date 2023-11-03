<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useRoom } from "../../model/store/room";
  import { useImageSources } from "../../model/store/imageSources";
  import { createImageSource, deleteImageSource } from "../../model/service/ImageSourceService";
  import Button from "../button/Button.svelte";
  import { useUsers } from "../../model/store/users";
  import { getImageSize } from "../../util/imageUtil";

  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { storage } from "../../util/firestore";

  export let open = false;

  const { room } = useRoom();
  const { myUserId } = useUsers()
  const { imageSources } = useImageSources()

  let isDeleteMode = false;

  const onClickUploadImages = () => {
    console.log("ImageSourceList.onClickUploadImages");
    const inputEl = document.createElement("input");
    inputEl.type = "file";
    inputEl.accept = "image/*";
    inputEl.multiple = true;
    inputEl.addEventListener("change", async (e) => {
      const { files = [] } = e.target as HTMLInputElement;
      if (!files) {
        return;
      }

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

  const uploadImageToFirebaseStorage = async (imageFile: File, fireStoragePath: string, metaData: object): Promise<string> => {
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

  const onClickDeleteImageSource = async (imageId: string) => {
    console.log("ImageSourceList.onClickDeleteImageSource");
    await deleteImageSource(imageId)
  }
</script>

<main>
  <details {open}>
    <summary>ImageSources</summary>
    <label>
      <input type="checkbox" bind:checked={isDeleteMode}>
      <span>削除ボタンを表示する</span>
    </label>
    <div class="image-flex-container">
      {#each $imageSources as imgSrc (imgSrc.id)}
        <div>
          <img src={imgSrc.url} alt={imgSrc.id} width="100" height="100">
          <Button handle={()=>onClickDeleteImageSource(imgSrc.id)}>削除</Button>
        </div>
      {/each}
    </div>
    <Button handle={()=>onClickUploadImages()}>Image Upload</Button>
  </details>
</main>

<style>
    .image-flex-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        justify-content: flex-start
    }
</style>