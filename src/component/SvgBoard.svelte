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

  const { activeBoard } = useBoards()
  const { mapChips } = useMapChips()

  let boardCSSTransformStyle = ""

  const onMouseDown = (e: MouseEvent) => {
    console.log("SvgBoard.onMouseDown", e);
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
  <g id={`board_${$activeBoard?.id}`} style={boardCSSTransformStyle}>
    <text class="crosshair-text" x="0" y="-3">O</text>
    <!--      <path-->
    <!--          d={crossHair}-->
    <!--          style="fill: none; stroke: dimgray; stroke-width: 1px"-->
    <!--      />-->
    {#each $mapChips as mapChip(mapChip.id)}
      <SvgMapChip mapChipId={mapChip.id}></SvgMapChip>

    {/each}
    <!--      {#each pawns as pawn(pawn.id)}-->
    <!--        <SvgPawn shadow pawnId={pawn.id}></SvgPawn>-->
    <!--      {/each}-->
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