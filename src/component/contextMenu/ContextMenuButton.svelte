<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->


<script lang="ts">
  import { ContextMenuItem } from "@/model/ContextMenu";
  import { execContextMenu } from "@/model/service/ContextMenuService";
  import { useContextMenu } from "@/model/store/contextMenu";
  import ContextMenuAccordion from "@/component/contextMenu/ContextMenuAccordion.svelte";

  export let item: ContextMenuItem;
  export let level: number = 0;

  const { contextMenuIds } = useContextMenu()

  const onClickItem = (e: MouseEvent, item: ContextMenuItem) => {
    console.log("ContextMenu.onClickItem");
    e.stopPropagation()
    execContextMenu(level, item)
  }
</script>

<div on:click={(e)=>onClickItem(e, item)}>
  <div
      class={`contextmenu contextmenu-parent__item ${item.disabled ? "disabled" : ""}`}>
    <span>{level},{item.text}</span>
    <span>{item.children.length !== 0 ? ($contextMenuIds[level] === item.id ? " ▼" : " ▶") : "" }</span>
  </div>
  {#if item.children.length !== 0 && $contextMenuIds[level] === item.id}
    <ContextMenuAccordion level={level+1} children={item.children}></ContextMenuAccordion>
  {/if}
</div>


<style lang="scss">
  div.contextmenu.contextmenu-parent__item {
    cursor: pointer;
    width: 250px;
    height: 2rem;
    padding: 0.5rem;
    background-color: ghostwhite;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-x: hidden;

    &:hover {
      background-color: lightgray;
    }

    &.disabled {
      cursor: not-allowed;
      text-decoration-line: line-through;
      color: gray;
    }
  }
</style>