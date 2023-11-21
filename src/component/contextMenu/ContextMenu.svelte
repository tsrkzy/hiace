<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">

  import { toCSS } from "@/util/style";
  import { useContextMenu } from "@/model/store/contextMenu";
  import { ContextMenuItem } from "@/model/ContextMenu";
  import { execContextMenu, hideContextMenu } from "@/model/service/ContextMenuService";

  const {
    showContextMenu, contextMenuItems,
    contextMenuX,
    contextMenuY,
    contextMenuId
  } = useContextMenu()

  $: accordionCss = (() => {
    return toCSS({
      left: `${$contextMenuX + 5}px`,
      top: `${$contextMenuY + 5}px`,
    })
  })()
  const onContextmenuOverlay = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onClickOverlay = () => {
    console.log("ContextMenu.onClickOverlay");
    hideContextMenu()
  }
  const onClickItem = (e:MouseEvent,item: ContextMenuItem) => {
    console.log("ContextMenu.onClickItem");
    e.stopPropagation()
    console.log(item);
    execContextMenu(item)
  }
</script>

{#if $showContextMenu}
  {$contextMenuId}
  <div
      class="contextmenu contextmenu-overlay"
      on:click={()=>onClickOverlay()}
      on:contextmenu={onContextmenuOverlay}>
    <div
        class="contextmenu contextmenu-parent__accordion"
        style={accordionCss}>
      {#each $contextMenuItems as item (item.id)}
        <div on:click={(e)=>onClickItem(e, item)}>
          <div class={`contextmenu contextmenu-parent__item ${item.disabled ? "disabled" : ""}`}>
            <span>{ item.text }</span>
            <span>{item.children.length !== 0 ? ($contextMenuId === item.id ? " ▼" : " ▶") : "" }</span>
          </div>
          {#if $contextMenuId === item.id}
            <div class={`contextmenu contextmenu-child__accordion ${item.disabled ? "disabled" : ""}`}>
              {#each item.children as child (child.id)}
                <div on:click={(e)=>onClickItem(e, child)}>
                  <div
                      class={`contextmenu contextmenu-child__item ${child.disabled ? "disabled" : ""}`}>
                    { child.text }
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
{/if}


<style lang="scss">
  div.contextmenu {
    &.contextmenu-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.2);
    }

    &.contextmenu-parent__accordion {
      position: absolute;
      left: 0;
      top: 0;
      color: dimgray;
      box-shadow: 0.5px 0.5px 2px dimgray;
    }

    &.contextmenu-parent__divider {
      border-top: 1px lightgray dashed;
    }

    &.contextmenu-parent__item {
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

    &.contextmenu-child__accordion {
      position: absolute;
      left: 100px;
      top: 0px;
      color: dimgray;
      box-shadow: 0.5px 0.5px 2px dimgray;
    }

    &.contextmenu-child__item {
      cursor: pointer;
      width: 250px;
      height: 2rem;
      padding: 0.5rem;
      background-color: ghostwhite;

      &:hover {
        background-color: lightgray;
      }

      &.disabled {
        cursor: not-allowed;
        text-decoration-line: line-through;
        color: gray;
      }
    }
  }
</style>
