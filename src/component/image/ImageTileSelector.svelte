<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">

  import { ImageSource } from "../../model/ImageSource.js";
  import ImageTile from "./ImageTile.svelte";

  export let imageSource: ImageSource;
  export let name: string = ""
  export let checkedId: string = ""
  export let onChange: (e: Event) => void|Promise<void>;

  $: checked = imageSource.id === checkedId
  $: borderColor = checked ? "red" : "black"
</script>

<label>
  <input type="radio"
         class="hide-radio-circle"
         {name}
         value={imageSource.id}
         checked={checked}
         on:change={onChange}
  />
  <ImageTile url={imageSource.url} borderColor={borderColor}>

  </ImageTile>
</label>

<style lang="scss">
  input[type=radio].hide-radio-circle {
    display: none;
  }
</style>