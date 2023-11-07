<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">

  import { useMapChips } from "../../model/store/mapChips";
  import { useImageSources } from "../../model/store/imageSources";
  import { Float } from "../../model/Float";
  import { updateMapChipDragLock, updateMapChipScalePp, } from "../../model/service/MapChipService";

  export let float: Float = {} as Float;


  const { mapChips } = useMapChips();
  const { imageSources } = useImageSources();

  $: floatId = float?.id;

  $: mapChipId = float?.args?.mapChipId;

  $: map = (() => {
    return $mapChips.find(m => m.id === mapChipId);
  })()

  $: imageSource = $imageSources.find(i => i.id === map?.image)

  const onChangeDragLockHandler = async (e: Event) => {
    console.log("MapEdit.onChangeDragLockHandler");
    if (!mapChipId) {
      return;
    }
    e.stopPropagation();
    const currentTarget = e.currentTarget as HTMLInputElement;
    const checked = currentTarget.checked;
    await updateMapChipDragLock({ mapChipId, dragLock: checked })
  }
  const onChangeScaleHandler = async (e: Event) => {
    if (!mapChipId) {
      return;
    }
    console.log("MapEdit.onChangeScaleHandler");
    e.stopPropagation();
    const currentTarget = e.currentTarget as HTMLInputElement;
    const value = currentTarget.value;
    await updateMapChipScalePp({ mapChipId, scalePp: value })
  }
</script>


<p>floatid: {floatId}</p>
<p>mapId: {mapChipId}</p>
<label>
  <input type="checkbox" checked={map?.dragLock} on:change={(e)=>onChangeDragLockHandler(e)}/>
  <span>位置を固定する</span>
</label>

<fieldset>
  <legend>サイズの拡縮: {map?.scalePp}%</legend>
  <input type="range" min="20" max="300" step="5" value="{map?.scalePp}" on:change={(e)=>onChangeScaleHandler(e)}/>
</fieldset>
<img
    src={imageSource?.url} alt={imageSource?.id} style="max-height: 200px; max-width: 200px"/>
<p>scroll-summary</p>