<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { MapChip } from "@/model/MapChip";
  import { openFloat } from "@/model/service/FloatService";
  import { ContentId } from "@/model/Float";
  import { deleteMapChip } from "@/model/service/MapChipService";
  import { useImageSources } from "@/model/store/imageSources";
  import { DEFAULT_MAP_IMAGE_URL } from "@/constant";
  import Button from "@/component/button/Button.svelte";

  export let mapChip: MapChip;

  const { imageSources } = useImageSources();

  $: mapChipImageUrl = (()=>{
    const imgSrc = $imageSources.find(i => i.id === mapChip?.image);
    if (!imgSrc) {
      return DEFAULT_MAP_IMAGE_URL;
    }
    return imgSrc.url
  })();

  const onClickMapEdit = async (mapChipId: string) => {
    console.log("BoardManager.onClickMapEdit", mapChipId);
    openFloat(ContentId.MAP_EDIT, { args: { mapChipId } });
  }

  const onClickDeleteMapChip = async (mapChipId: string) => {
    console.log("BoardManager.onClickDeleteMapChip", mapChipId);
    await deleteMapChip({ mapChipId })
  }

</script>

<fieldset>
  <legend>マップ: { mapChip.id }</legend>
  <img src={ mapChipImageUrl } class="map-chip-image" alt="map"/>
  <Button handle={()=>onClickMapEdit(mapChip.id)}>編集</Button>
  <Button handle={()=>onClickDeleteMapChip(mapChip.id)}>削除</Button>
</fieldset>

<style lang="scss">
  .map-chip-image {
    max-height: 100px;
  }
</style>