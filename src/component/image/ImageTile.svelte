<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { toCSS } from "../../util/style";

  export let url = "";
  export let alt = "image";
  export let width = 48;
  export let height = 48;
  export let borderColor = "#000000";

  $: styleObj = {
    width: `${width}px`,
    height: `${height}px`,
    borderColor: `${borderColor}`,
  };
  $: styleStr = toCSS(styleObj)
</script>

<div class="alias-image__chip" style={styleStr}>
  {#if url}
    <img src={url} alt={alt}>
  {:else}
    <div class="alias-image__dummy"><span>NO IMAGE</span></div>
  {/if}
</div>

<style lang="scss">
  div {
    &.alias-image__chip {
      width: 48px;
      height: 48px;
      border: 1px solid #000000;
      padding: 1px;
      margin: 1px;

      div.alias-image__dummy {
        width: 100%;
        height: 100%;
        background-color: #000000;

        span {
          color: #ffffff;

        }
      }

      & img {
        width: 100%;
        height: 100%;
      }
    }


  }
</style>