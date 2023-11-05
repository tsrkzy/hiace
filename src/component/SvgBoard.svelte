<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">

  import { useBoards } from "../model/store/boards";
  import SvgMapChip from "./SvgMapChip.svelte";
  import { useMapChips } from "../model/store/mapChips";
  import { toCSS } from "../util/style";
  import SvgPawn from "./SvgPawn.svelte";
  import { usePawns } from "../model/store/pawns";

  const { activeBoard } = useBoards()
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

  const onWheel = (e: MouseEvent) => {
    console.log("SvgBoard.onWheel", e);
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
      <SvgPawn shadow pawnId={pawn.id}></SvgPawn>
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