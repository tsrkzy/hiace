<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">

  import { toCSS } from "@/util/style";
  import { useTables } from "@/model/store/tables";

  const { cellEditorX, cellEditorY, cellEditorTarget } = useTables()

  $: accordionCss = toCSS({
    left: `${$cellEditorX + 5}px`,
    top: `${$cellEditorY + 5}px`,
  })

</script>

<div class={`cell-editor`} style={accordionCss}>
  <p>tableId: {$cellEditorTarget?.tableId}</p>
  <p>columnId: {$cellEditorTarget?.cellData.columnId}</p>
  <p>characterId: {$cellEditorTarget?.cellData.characterId}</p>
  <p>value: {$cellEditorTarget?.cellData.value}</p>
  <p>dataType: {$cellEditorTarget?.cellData.dataType}</p>
</div>

<style lang="scss">
  div.cell-editor {
    position: absolute;
    left: 0;
    top: 0;
    width: 200px;
    height: 200px;
    background-color: ghostwhite;
    box-shadow: -1.5px 1.5px 8px dimgray;
  }
</style>