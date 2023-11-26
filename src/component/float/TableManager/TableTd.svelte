<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { type CellData } from "@/component/float/TableManager/tableTypes";
  import { ColumnDataTypes } from "@/model/Column";
  import Checkbox from "@/component/input/Checkbox.svelte";
  import { useTables } from "@/model/store/tables";
  import { tick } from "svelte";

  export let tableId: string;
  export let cell: CellData;

  const {
    setCellEditorTarget,
    setCellEditorX,
    setCellEditorY,
    setShowCellEditor
  } = useTables()

  const onClickHandler = (e: MouseEvent, cell: CellData) => {
    console.log("TableTd.onClickHandler", e);
    e.stopPropagation()

    if (cell.system) {
      console.log("ignore");
      return false;
    }

    const { clientX, clientY } = e

    setCellEditorTarget({ tableId, cellData: cell })
    setCellEditorX(clientX)
    setCellEditorY(clientY)
    setShowCellEditor(true)

    tick().then(()=>{
      const editor = document.getElementById("cell-editor-input") as HTMLInputElement
      editor.select()
    })
  }

  const onChangeHandler = (e: Event,) => {
    console.log("TableTd.onChangeHandler", e);
    e.stopPropagation()
  }
</script>
<td>
  {#if cell.dataType === ColumnDataTypes.BOOL}
    <Checkbox checked={!!cell.value} label="" onChange={(e)=>onChangeHandler(e)}></Checkbox>
  {:else }
    <div class={`cell ${cell.system? "disabled":""}`} on:click={e=>onClickHandler(e, cell)}>
      <span>{cell.value}</span>
    </div>
  {/if}
</td>

<style lang="scss">

  td {
    border: 1px solid gray;

    div.cell {
      width: 100%;
      height: 100%;
      min-height: 1.0rem;
      cursor: pointer;

      &.disabled {
        cursor: not-allowed;
      }
    }
  }
</style>