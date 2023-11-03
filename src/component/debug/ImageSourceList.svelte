<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useImageSources } from "../../model/store/imageSources";
  import { deleteImageSource, registerImage } from "../../model/service/ImageSourceService";
  import Button from "../button/Button.svelte";
  import { useRoom } from "../../model/store/room";
  import { useUsers } from "../../model/store/users";

  export let open = false;

  const { imageSources } = useImageSources()
  const { room } = useRoom()
  const { myUserId } = useUsers()

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

      const roomId = $room.id
      const userId = $myUserId;

      /* input要素から取得した画像ファイルをアップロードし、firestoreに登録する */
      await Promise.all(Array.from(files).map(f => registerImage(f, roomId, userId)));
    }, false);
    inputEl.click();
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