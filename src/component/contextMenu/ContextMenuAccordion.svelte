<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import ContextMenuButton from "@/component/contextMenu/ContextMenuButton.svelte";
  import { ContextMenuItem } from "@/model/ContextMenu.js";
  import { toCSS } from "@/util/style";
  import { useContextMenu } from "@/model/store/contextMenu";

  export let children: ContextMenuItem[];
  export let level: number;

  const isRoot = level === 0;

  const { contextMenuX, contextMenuY, } = useContextMenu()

  $: accordionCss = (() => {

    return toCSS(isRoot
      ? { left: `${$contextMenuX + 5}px`, top: `${$contextMenuY + 5}px`, }
      : { left: "180px", })
  })()

</script>

<div class={`contextmenu accordion`} style={accordionCss}>
  {#each children as child (child.id)}
    <ContextMenuButton
        {level}
        item={child}
    ></ContextMenuButton>
  {/each}
</div>

<style lang="scss">
  div.contextmenu.accordion {
    position: absolute;
    left: 0;
    top: 0;
    color: dimgray;
    box-shadow: 0.5px 0.5px 2px dimgray;
  }
</style>