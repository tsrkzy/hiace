<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useMapChips } from "../model/store/mapChips";
  import { useImageSources } from "../model/store/imageSources";
  import { toCSS } from "../util/style";
  import { useBoards } from "../model/store/boards";
  import { updateMapChipTransfer } from "../model/service/MapChipService";
  import { hideObstaclesToDrag, showObstaclesToDrag } from "../util/drag";

  export let mapChipId: string = "";

  const { mapChips, draggedMapChipId, setDraggedMapChipId } = useMapChips()
  const { imageSources } = useImageSources()
  const { activeBoard } = useBoards()

  $: mapChip = (() => {
    return $mapChips.find(mapChip => mapChip.id === mapChipId)
  })()

  $: imageSource = (() => {
    return $imageSources.find(imageSource => imageSource.id === mapChip?.image)
  })()

  $: scaledTransform = (() => {
    const { e, f } = new DOMMatrix(mapChip?.transform);
    const scale = (mapChip?.scalePp || 100) / 100;
    return new DOMMatrix([scale, 0, 0, scale, e, f]);
  })()

  $: mapStyleString = toCSS({ transform: `${scaledTransform}` });

  $: isDragged = $draggedMapChipId === mapChipId;

  const DEFAULT_MAP_IMAGE_URL = "../assets/images/default_map.jpg";
  const DEFAULT_MAP_IMAGE_WIDTH = 1109
  const DEFAULT_MAP_IMAGE_HEIGHT = 840

  const onMouseDown = (e: MouseEvent) => {
    console.log("SvgMap.onMouseDown", e);
    if (!mapChip) {
      return;
    }

    if (mapChip?.dragLock) {
      /* ロック中の場合はpropagationする前にreturn */
      console.log(`mapChip is locked: ${mapChipId}`);
      return false;
    }

    e.stopPropagation();


    const downX = e.clientX;
    const downY = e.clientY;

    const boardEl = document.getElementById(`board_${$activeBoard?.id}`) as HTMLElement&SVGGElement;
    const mapChipEl = document.getElementById(`map_${mapChipId}`) as HTMLElement&SVGGElement;

    // 要素が取得できなければログだけして終了
    if (!boardEl || !mapChipEl) {
      console.log("SvgMap.onMouseDown: boardEl or mapChipEl is null");
      return false;
    }

    setDraggedMapChipId(mapChipId);
    hideObstaclesToDrag()

    const ctmB = boardEl.getCTM() as DOMMatrix; // global to board
    const ctmM = mapChipEl.getCTM() as DOMMatrix; // board to mapChip
    const ctmG2M = ctmB.inverse().multiply(ctmM); // global to mapChip


    function globalToLocal(dx: number, dy: number): DOMMatrix {
      /* 変位をglobalからDOMローカルの座標系へ変換 */
      const { a, b, c, d, e, f } = ctmG2M;
      const init = [a, b, c, d, e, f];
      const $$r = new DOMMatrix(init);
      const dxx = dx / ctmM.a;
      const dyy = dy / ctmM.a;
      return $$r.translate(dxx, dyy);
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!mapChip) {
        return;
      }

      e.stopPropagation();
      mapChip.transform = `${globalToLocal(e.clientX - downX, e.clientY - downY)}`;
    }

    const onMouseUp = async (e: MouseEvent) => {
      if (!mapChip) {
        return;
      }

      console.log("SvgMap.onMouseUp", e);
      e.stopPropagation();

      setDraggedMapChipId("");
      showObstaclesToDrag()

      mapChipEl.removeEventListener("mousemove", onMouseMove);
      mapChipEl.removeEventListener("mouseup", onMouseUp);
      mapChipEl.removeEventListener("mouseleave", onMouseUp);

      const newTransform = `${globalToLocal(e.clientX - downX, e.clientY - downY)}`
      mapChip.transform = newTransform

      await updateMapChipTransfer({ mapChipId, transform: newTransform });
    }

    mapChipEl.addEventListener("mousemove", onMouseMove, false);
    mapChipEl.addEventListener("mouseup", onMouseUp, false);
    mapChipEl.addEventListener("mouseleave", onMouseUp, false);

  }
</script>

{#if mapChip}
  <g
      id={`map_${mapChipId}`}
      style={mapStyleString}
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
          stroke="transparent"
          fill="transparent"
      ></rect>
    {/if}
  </g>
{/if}