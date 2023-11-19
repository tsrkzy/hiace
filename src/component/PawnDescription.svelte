<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { usePawns } from "@/model/store/pawns";

  const { pawnDescriptionText, pawnDescriptionSide } = usePawns()

  $: sideClassName = $pawnDescriptionSide === "left" ? "right" : "left";
  $: lines = (() => {
    return $pawnDescriptionText.split("\n")
  })()
</script>

{#if $pawnDescriptionText}
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