<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { hideBackdrop } from "@/util/backdrop";

  export let show: boolean = false

  const onContextmenuBackDrop = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onClickBackDrop = () => {
    console.log("ContextMenu.onClickBackDrop");
    hideBackdrop();
  }
</script>

<div
    class={`backdrop ${show?"show":""}`}
    on:click={()=>onClickBackDrop()}
    on:contextmenu={onContextmenuBackDrop}>
  <slot></slot>
</div>


<style lang="scss">
  div.backdrop {
    z-index: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.2);
    display: none;

    &.show {
      display: block;
    }
  }
</style>
