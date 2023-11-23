<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">

  import { useContextMenu } from "@/model/store/contextMenu";
  import { hideContextMenu } from "@/model/service/ContextMenuService";
  import ContextMenuAccordion from "@/component/contextMenu/ContextMenuAccordion.svelte";

  const {
    showContextMenu,
    contextMenuItems,
  } = useContextMenu()

  const onContextmenuOverlay = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onClickOverlay = () => {
    console.log("ContextMenu.onClickOverlay");
    hideContextMenu()
  }
</script>

<div
    class={`contextmenu contextmenu-overlay ${$showContextMenu?"show":""}`}
    on:click={()=>onClickOverlay()}
    on:contextmenu={onContextmenuOverlay}>
  <ContextMenuAccordion level={0} children={$contextMenuItems}></ContextMenuAccordion>
</div>


<style lang="scss">
  div.contextmenu {
    &.contextmenu-overlay {
      z-index: 1;
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
  }
</style>
