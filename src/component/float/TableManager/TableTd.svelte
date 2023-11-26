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

  export let cell: CellData;

  const onClickHandler = (e: MouseEvent) => {
    console.log("TableTd.onClickHandler", e);
    e.stopPropagation()
  }

  const onChangeHandler = (e: Event) => {
    console.log("TableTd.onChangeHandler", e);
    e.stopPropagation()
  }
</script>
<td>
  {#if cell.dataType === ColumnDataTypes.BOOL}
    <Checkbox checked={!!cell.value} label="" onChange={(e)=>onChangeHandler(e)}></Checkbox>
  {:else }
    <div class={`cell ${cell.system? "disabled":""}`} on:click={e=>onClickHandler(e)}>
      <span>{cell.value}</span>
    </div>
  {/if}
</td>

<style lang="scss">

  td {
    border: 1px solid gray;

    div.cell {
      width: 100%;
      height:100%;
      min-height: 1.0rem;
      cursor: pointer;

      &.disabled {
        cursor: not-allowed;
      }
    }
  }
</style>