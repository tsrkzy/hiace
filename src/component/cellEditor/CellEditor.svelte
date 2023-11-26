<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">

  import { toCSS } from "@/util/style";
  import { useTables } from "@/model/store/tables";
  import { ColumnDataTypes } from "@/model/Column.js";
  import StringCellEditor from "@/component/cellEditor/StringCellEditor.svelte";
  const { cellEditorX, cellEditorY, cellEditorTarget } = useTables()

  $: accordionCss = (() => {
    const OFFSET = 5;
    const { innerHeight, innerWidth } = window
    const isWest = $cellEditorX < innerWidth / 2;
    const isNorth = $cellEditorY < innerHeight / 2;
    const cssObj: {
      left?: string,
      right?: string,
      top?: string,
      bottom?: string,

    } = {};
    if (isWest) {
      cssObj.left = `${$cellEditorX + OFFSET}px`;
    } else {
      cssObj.right = `${innerWidth - $cellEditorX - OFFSET}px`;
    }

    if (isNorth) {
      cssObj.top = `${$cellEditorY + OFFSET}px`;
    } else {
      cssObj.bottom = `${innerHeight - $cellEditorY - OFFSET}px`;
    }
    return toCSS(cssObj);
  })()
  const onClickCellEditorWindow = async (e: Event) => {
    e.stopPropagation();
  }
</script>

<div class={`cell-editor`} style={accordionCss} on:click={e=>onClickCellEditorWindow(e)}>
  {#if $cellEditorTarget?.cellData.dataType === ColumnDataTypes.STR}
    <StringCellEditor></StringCellEditor>
  {:else if $cellEditorTarget?.cellData.dataType === ColumnDataTypes.INT}
    <p>int</p>
  {:else if $cellEditorTarget?.cellData.dataType === ColumnDataTypes.BOOL}
    <p>bool</p>
  {/if}
</div>

<style lang="scss">
  div.cell-editor {
    position: absolute;
    padding: 1rem;
    background-color: ghostwhite;
    box-shadow: -1.5px 1.5px 8px dimgray;
  }
</style>