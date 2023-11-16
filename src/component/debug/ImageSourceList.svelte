<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useImageSources } from "@/model/store/imageSources";
  import { deleteImageSource, } from "@/model/service/ImageSourceService";
  import Button from "@/component/button/Button.svelte";
  import ImageUploadButton from "@/component/button/ImageUploadButton.svelte";

  export let open = false;

  const { imageSources } = useImageSources()

  let isDeleteMode = false;


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
    <ImageUploadButton></ImageUploadButton>
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