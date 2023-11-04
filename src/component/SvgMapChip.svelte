<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useMapChips } from "../model/store/mapChips";
  import { useImageSources } from "../model/store/imageSources";

  export let mapChipId: string = "";

  const { mapChips } = useMapChips()
  const { imageSources } = useImageSources()
  $: mapChip = (() => {
    return $mapChips.find(mapChip => mapChip.id === mapChipId)
  })()
  $: imageSource = (() => {
    return $imageSources.find(imageSource => imageSource.id === mapChip?.image)
  })()
  let loaded = true;
  let isDragged = false;
  let transformStyle: string = "transform: translate(0, 0);";

  const DEFAULT_MAP_IMAGE_URL = "../assets/images/default_map.jpg";
  const DEFAULT_MAP_IMAGE_WIDTH = 1109
  const DEFAULT_MAP_IMAGE_HEIGHT = 840

  const onMouseDown = (e: MouseEvent) => {
    console.log("SvgMap.onMouseDown", e);
  }
</script>

{#if loaded && mapChip}
  <g
      id={`map_${mapChipId}`}
      style={transformStyle}
      on:mousedown={(e)=>onMouseDown(e)}
  >
    <rect
        width={imageSource?.width || DEFAULT_MAP_IMAGE_WIDTH}
        height={imageSource?.height || DEFAULT_MAP_IMAGE_HEIGHT}
        stroke="red"
        fill="transparent"
    ></rect>
    <rect
        width={imageSource?.width || DEFAULT_MAP_IMAGE_WIDTH}
        height={imageSource?.height || DEFAULT_MAP_IMAGE_HEIGHT}
        stroke="transparent"
        fill="dimgray"
    ></rect>
    <image width={imageSource?.width || DEFAULT_MAP_IMAGE_WIDTH}
           height={imageSource?.height || DEFAULT_MAP_IMAGE_HEIGHT}
           href={imageSource?.url || DEFAULT_MAP_IMAGE_URL}
    >

    </image>
    <!-- ドラッグ中の当たり判定拡張 -->
    {#if isDragged}
      <rect
          x={-1000 / 2}
          y={-1000 / 2}
          width={imageSource?.width || DEFAULT_MAP_IMAGE_WIDTH + 1000}
          height={imageSource?.height || DEFAULT_MAP_IMAGE_HEIGHT + 1000}
          stroke="red"
          fill="transparent"
      ></rect>
    {/if}
  </g>
{/if}