<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { useFloats } from "../../model/store/floats";
  import FloatWindow from "./FloatWindow.svelte";
  const { floats } = useFloats();
</script>


<div class="float-group__container">
  {#each $floats as f}
    <FloatWindow float={f}>
      {f.id}
    </FloatWindow>
  {/each}
</div>

<style lang="scss">
  .float-group__container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
</style>
