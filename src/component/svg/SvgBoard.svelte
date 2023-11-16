<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">

  import { useBoards } from   "@/model/store/boards";
  import { useMapChips } from "@/model/store/mapChips";
  import { usePawns } from    "@/model/store/pawns";
  import SvgMapChip from "@/component/svg/SvgMapChip.svelte";
  import SvgPawn from "@/component/svg/SvgPawn.svelte";
  import { toCSS } from "@/util/style";
  import { isMacOS } from "@/util/agent";

  const { activeBoard, setDraggedBoardId } = useBoards()
  const { mapChips } = useMapChips()
  const { pawns } = usePawns()


  const zoom = 100;
  const z = zoom / 100;
  let transformMatrix = `${new DOMMatrix([z, 0, 0, z, 0, 0]).inverse()}`;
  $: boardStyleString = toCSS({ transform: `${transformMatrix}` });

  const onMouseDown = (e: MouseEvent) => {
    console.log("SvgBoard.onMouseDown");
    e.stopPropagation();
    e.preventDefault();

    setDraggedBoardId($activeBoard?.id || "");

    const elSvg = document.getElementById("svg-table") as HTMLElement;
    elSvg.classList.add("drag");

    const downX = e.clientX;
    const downY = e.clientY;

    /* boardの座標系をglobalへ変換する行列 */
    const boardEl = document.getElementById(`board_${$activeBoard?.id}`) as HTMLElement&SVGGElement;
    const ctmBoard = boardEl.getCTM() as DOMMatrix

    const onMove = (e: MouseEvent) => {
      e.stopPropagation();
      const t = globalToLocal(e.clientX - downX, e.clientY - downY, ctmBoard);
      transformMatrix = `${t}`
    }

    const onMouseUp = (e: MouseEvent) => {
      console.log("SvgBoard.onMouseUp");
      e.stopPropagation();
      const t = globalToLocal(e.clientX - downX, e.clientY - downY, ctmBoard);
      transformMatrix = `${t}`
      elSvg.classList.remove("drag");

      setDraggedBoardId("");

      elSvg.removeEventListener("mousemove", onMove);
      elSvg.removeEventListener("mouseup", onMouseUp);
      elSvg.removeEventListener("mouseleave", onMouseUp);
    }

    elSvg.addEventListener("mousemove", onMove, false);
    elSvg.addEventListener("mouseup", onMouseUp, false);
    elSvg.addEventListener("mouseleave", onMouseUp, false);

  }

  function globalToLocal(dx: number, dy: number, ctm = new DOMMatrix()) {
    /* 変位をglobalからDOMローカルの座標系へ変換 */
    return new DOMMatrix([1, 0, 0, 1, dx, dy]).multiply(ctm);
  }

  const onWheel = (event: WheelEvent) => {
    const SVG_MARGIN = 40;
    const { clientX: _x, clientY: _y } = event;
    const x = _x - SVG_MARGIN;
    const y = _y - SVG_MARGIN;

    /* windowsの場合の正。osxは逆 */
    const dir = (event.deltaY > 0 ? 1 : -1) * (isMacOS() ? -1 : 1);
    const t = new DOMMatrix(transformMatrix);
    let { a, e, f } = t;

    /* osxの場合はtrackpadとして扱う
     * 慣性スクロールでwheelがマウスの場合より多く発生するので、
     * 係数で抑え込む */
    const MOUSE_SCROLL_SPEED = 1.0;
    const TRACKPAD_SCROLL_SPEED = 0.2;
    const os = isMacOS() ? TRACKPAD_SCROLL_SPEED : MOUSE_SCROLL_SPEED;

    /* Windowsのマウスでwheelが1回発火したときの拡大率のステップ */
    const ZOOM_RATE_DELTA = 0.1;
    const DELTA = a * ZOOM_RATE_DELTA * os;

    /* 拡大率の下限値と上限値 */
    const MIN_ZOOM_RATE = 0.1;
    const MAX_ZOOM_RATE = 3.0;

    /* 倍率100%の際の、boardの原点から測ったクリック位置 */
    const ix = (x - e) / a;
    const iy = (y - f) / a;

    /* 倍率を増減 */
    a += dir * DELTA;
    a = Math.max(a, MIN_ZOOM_RATE);
    a = Math.min(a, MAX_ZOOM_RATE);

    /* クリック位置から逆算 */
    const newE = x + -a * ix;
    const newF = y + -a * iy;

    const newTransform = new DOMMatrix([a, 0, 0, a, newE, newF]);
    // this.updateWeathercock(newTransform);
    transformMatrix = `${newTransform}`;
  }

</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    id="svg-table"
    on:mousedown={(e)=>onMouseDown(e)}
    on:wheel={(e)=>onWheel(e)}
>
  <g id={`board_${$activeBoard?.id}`} style={boardStyleString}>
    <text class="crosshair-text" x="0" y="-3">O</text>
    <!--      <path-->
    <!--          d={crossHair}-->
    <!--          style="fill: none; stroke: dimgray; stroke-width: 1px"-->
    <!--      />-->
    {#each $mapChips as mapChip(mapChip.id)}
      <SvgMapChip mapChipId={mapChip.id}></SvgMapChip>

    {/each}
    {#each $pawns as pawn(pawn.id)}
      <SvgPawn pawnId={pawn.id}></SvgPawn>
    {/each}
    <!--      {#each dices as dice(dice.id)}-->
    <!--        <SvgDice shadow diceId={dice.id}></SvgDice>-->
    <!--      {/each}-->
    <!--      {#each arrows as arrow(arrow.id)}-->
    <!--        <SvgArrow shadow arrowId={arrow.id}></SvgArrow>-->
    <!--      {/each}-->
    <!--      {#each pawns as pawn(pawn.id)}-->
    <!--        <SvgPawn pawnId={pawn.id}></SvgPawn>-->
    <!--      {/each}-->
    <!--      {#each dices as dice(dice.id)}-->
    <!--        <SvgDice diceId={dice.id}></SvgDice>-->
    <!--      {/each}-->
  </g>
  <!--  <path-->
  <!--      id="weathercock"-->
  <!--      d={weathercockPath}-->
  <!--  ></path>-->
</svg>


<style lang="scss">
  #svg-table {
    background-color: ghostwhite;
    width: 100vw;
    height: 100vh;
  }

  #weathercock {
    stroke: gray;
    fill: lightgray;
    fill-opacity: 0.8;
    transform: matrix(1, 0, 0, 1, 20, 20);
  }

  text.crosshair-text {
    fill: black;
  }
</style>