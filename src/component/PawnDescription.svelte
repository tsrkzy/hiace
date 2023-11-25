<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { usePawns } from "@/model/store/pawns";
  import { useBoards } from "@/model/store/boards";
  import { useMapChips } from "@/model/store/mapChips";
  import { useDices } from "@/model/store/dices";

  const { draggedBoardId } = useBoards()
  const { draggedMapChipId } = useMapChips()
  const { pawnDescriptionText, pawnDescriptionSide, draggedPawnId } = usePawns()
  const { draggedDiceId } = useDices()

  $: sideClassName = $pawnDescriptionSide === "left" ? "right" : "left";
  $: lines = (() => {
    return $pawnDescriptionText.split("\n")
  })()

  $: isRender = (!$draggedBoardId) && (!$draggedMapChipId) && !($draggedPawnId) && !($draggedDiceId)
</script>

{#if $pawnDescriptionText && isRender }
  <div id="pawn-description" class={`pawn-description ${sideClassName}`}>
    {#each lines as line}
      <p>{line}&nbsp;</p>
    {/each}
  </div>
{/if}
<style lang="scss">
  div.pawn-description {
    width: 45vw;
    height: 95vh;
    position: absolute;
    margin: 1rem;
    background-color: #eeeeee;
    overflow-y: scroll;

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }

    p {
      color: #221111;
      line-height: 1.5rem;
      word-wrap: break-word;
      white-space: normal;
    }
  }
</style>