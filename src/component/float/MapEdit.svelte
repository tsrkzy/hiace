<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">

  import { useMapChips } from "../../model/store/mapChips";
  import { Float } from "../../model/Float";
  import { updateMapChip } from "../../model/service/MapChipService";
  import ImageTileSelector from "../image/ImageTileSelector.svelte";
  import { useImageSources } from "../../model/store/imageSources";

  export let float: Float = {} as Float;


  const { mapChips } = useMapChips();
  const { imageSources } = useImageSources()

  $: floatId = float?.id;

  $: mapChipId = float?.args?.mapChipId;

  $: mapChip = (() => {
    return $mapChips.find(m => m.id === mapChipId);
  })()


  const onChangeDragLockHandler = async (e: Event) => {
    console.log("MapEdit.onChangeDragLockHandler");
    if (!mapChipId) {
      return;
    }
    e.stopPropagation();
    const currentTarget = e.currentTarget as HTMLInputElement;
    const checked = currentTarget.checked;
    await updateMapChip({ mapChipId, criteria: { dragLock: checked } })
  }
  const onChangeScaleHandler = async (e: Event) => {
    if (!mapChipId) {
      return;
    }
    console.log("MapEdit.onChangeScaleHandler");
    e.stopPropagation();
    const currentTarget = e.currentTarget as HTMLInputElement;
    const scalePp = parseInt(currentTarget.value, 10);

    await updateMapChip({ mapChipId, criteria: { scalePp }, })
  }

  const onChangeImageSource = async (e: Event) => {
    if (!mapChipId) {
      return;
    }
    console.log("MapEdit.onChangeImageSource");
    e.stopPropagation();
    const currentTarget = e.currentTarget as HTMLInputElement;
    const image = currentTarget.value
    await updateMapChip({ mapChipId, criteria: { image }, })
  }
</script>


<p>floatid: {floatId}</p>
<p>mapId: {mapChipId}</p>
<label>
  <input type="checkbox" checked={mapChip?.dragLock} on:change={(e)=>onChangeDragLockHandler(e)}/>
  <span>位置を固定する</span>
</label>

<fieldset>
  <legend>サイズの拡縮: {mapChip?.scalePp}%</legend>
  <input type="range" min="20" max="300" step="5" value="{mapChip?.scalePp}" on:change={(e)=>onChangeScaleHandler(e)}/>
</fieldset>
{mapChip?.image}
<div style="display: flex;flex-wrap: wrap;flex-direction: row;">
  {#each $imageSources as imgSrc (imgSrc.id)}
    <ImageTileSelector
        name={`map-chip-editor_image-select_float-${floatId}`}
        checkedId={mapChip?.image}
        imageSource={imgSrc}
        onChange={onChangeImageSource}
    ></ImageTileSelector>
  {/each}
</div>
