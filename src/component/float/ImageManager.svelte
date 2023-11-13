<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import ImageUploadButton from "../button/ImageUploadButton.svelte";
  import Checkbox from "../input/Checkbox.svelte";
  import { useImageSources } from "../../model/store/imageSources";
  import { Float } from "../../model/Float";
  import ImageTileSelector from "../image/ImageTileSelector.svelte";
  import { useUsers } from "../../model/store/users";
  import Button from "../button/Button.svelte";
  import { addTagImageSource, deleteImageSource, removeTagImageSource, updateImageSource } from "../../model/service/ImageSourceService";

  const { imageSources } = useImageSources()
  const { myUserId, users } = useUsers()

  export const float = {} as Float;

  let imageSourceId = ""
  let onlyMine = false
  let onlyMap = false
  let onlyCharacter = false
  let onlyUntagged = false
  $: imageSource = $imageSources.find(i => i.id === imageSourceId);
  $: ownerId = imageSource?.owner;
  $: owner = $users.find(u => u.id === ownerId);
  $: filteredImageSources = $imageSources.filter(imgSrc => {
    if (onlyMine && imgSrc.owner !== $myUserId) {
      return false;
    }
    if (onlyMap && imgSrc.tags.indexOf('map') === -1) {
      return false;
    }
    if (onlyCharacter && imgSrc.tags.indexOf('character') === -1) {
      return false;
    }
    if (onlyUntagged && imgSrc.tags.length !== 0) {
      return false;
    }
    return true;
  });


  const onMakeHidden = async (e: Event) => {
    console.log("ImageManager.onMakeHidden", e);
    if (!imageSourceId) {
      return
    }
    const currentTarget = e.currentTarget as HTMLInputElement;
    const hidden = currentTarget.checked
    await updateImageSource({ imageSourceId, criteria: { hidden } })
  }
  const onMakeMap = async (e: Event) => {
    console.log("ImageManager.onMakeMap", e);
    if (!imageSourceId) {
      return
    }
    const currentTarget = e.currentTarget as HTMLInputElement;
    const makeMap = currentTarget.checked
    if (makeMap) {
      await addTagImageSource({ imageSourceId, tag: 'map' })
    } else {
      await removeTagImageSource({ imageSourceId, tag: 'map' })
    }
  }
  const onMakeCharacter = async (e: Event) => {
    console.log("ImageManager.onMakeCharacter", e);
    if (!imageSourceId) {
      return
    }
    const currentTarget = e.currentTarget as HTMLInputElement;
    const makeCharacter = currentTarget.checked
    if (makeCharacter) {

      await addTagImageSource({ imageSourceId, tag: 'character' })
    } else {
      await removeTagImageSource({ imageSourceId, tag: 'character' })

    }
  }
  const onClickDeleteImageSource = async () => {
    console.log("ImageManager.onClickDeleteImageSource",);
    if (!imageSourceId) {
      return
    }
    await deleteImageSource(imageSourceId);
    imageSourceId = ""
  }
  const onChangeOnlyMine = (e: Event) => {
    console.log("ImageManager.onChangeOnlyMine",);
    const currentTarget = e.currentTarget as HTMLInputElement;
    onlyMine = currentTarget.checked
  }
  const onChangeOnlyMap = (e: Event) => {
    console.log("ImageManager.onChangeOnlyMap",);
    const currentTarget = e.currentTarget as HTMLInputElement;
    onlyMap = currentTarget.checked
  }
  const onChangeOnlyCharacter = (e: Event) => {
    console.log("ImageManager.onChangeOnlyCharacter",);
    const currentTarget = e.currentTarget as HTMLInputElement;
    onlyCharacter = currentTarget.checked
  }
  const onChangeOnlyUntagged = (e: Event) => {
    console.log("ImageManager.onChangeOnlyUntagged",);
    const currentTarget = e.currentTarget as HTMLInputElement;
    onlyUntagged = currentTarget.checked
  }
  const onChangeImageSource = (e: Event) => {
    console.log("ImageManager.onChangeImageSource",);
    const currentTarget = e.currentTarget as HTMLInputElement;
    imageSourceId = currentTarget.value
  }
</script>

<ImageUploadButton></ImageUploadButton>
{imageSourceId}
{imageSource?.hidden}
<fieldset>
  <legend>画像の情報</legend>
  <ul>
    <li>
      <p>持ち主: { owner?.email }</p>
    </li>
    <li>
      <Checkbox
          label="他のユーザから隠す"
          checked={!!(imageSource?.hidden)}
          onChange={(e)=>onMakeHidden(e)}
          disabled={!imageSourceId}
      ></Checkbox>
    </li>
    <li>
      <Checkbox
          label="#マップ"
          checked={imageSource?.tags.indexOf('map') !== -1}
          onChange={(e)=>onMakeMap(e)}
          disabled={!imageSourceId}
      ></Checkbox>
    </li>
    <li>
      <Checkbox
          label="#キャラクタ"
          checked={imageSource?.tags.indexOf('character') !== -1}
          onChange={(e)=>onMakeCharacter(e)}
          disabled={!imageSourceId}
      ></Checkbox>
    </li>
    <li>
      <Button handle={()=>onClickDeleteImageSource}>削除</Button>
    </li>
  </ul>
</fieldset>
<fieldset>
  <legend>フィルタ設定(AND)</legend>
  <ul>
    <li>
      <Checkbox
          label="自分の画像"
          checked={onlyMine}
          onChange={(e)=>onChangeOnlyMine(e)}
      ></Checkbox>
    </li>
    <li>
      <Checkbox
          label="#マップ"
          checked={onlyMap}
          onChange={(e)=>onChangeOnlyMap(e)}
          disabled={onlyUntagged}
      ></Checkbox>
    </li>
    <li>
      <Checkbox
          label="#キャラクタ"
          checked={onlyCharacter}
          onChange={(e)=>onChangeOnlyCharacter(e)}
          disabled={onlyUntagged}
      ></Checkbox>
    </li>
    <li>
      <Checkbox
          label="#タグなし"
          checked={onlyUntagged}
          onChange={(e)=>onChangeOnlyUntagged(e)}
      ></Checkbox>
    </li>
  </ul>
</fieldset>
<div class="image-source-tile__container">
  {#each filteredImageSources as imgSrc (imgSrc.id)}
    <ImageTileSelector
        imageSource={imgSrc}
        name={`image-source-manager_float-${float.id}`}
        checkedId={imageSourceId}
        onChange={(e)=>onChangeImageSource(e)}
        text={(imgSrc.hidden && imgSrc.owner === $myUserId )? "個人" : ""}
    ></ImageTileSelector>
  {/each}
</div>

<style lang="scss">
  .image-source-tile__container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
</style>