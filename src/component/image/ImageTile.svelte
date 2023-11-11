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

  const styleObj = {
    width: `${width}px`,
    height: `${height}px`,
    border: `1px solid ${borderColor}`,
  };
  $: styleStr = toCSS(styleObj)
</script>

<div class="alias-image__chip" style={styleStr}>
  <img src={url} alt={alt}>
</div>

<style lang="scss">
  div.alias-image__chip {
    width: 48px;
    height: 48px;
    border: 1px solid #000000;

    & img {
      width: 100%;
      height: 100%;
    }
  }
</style>