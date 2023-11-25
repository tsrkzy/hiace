<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { type CellData } from "@/component/float/TableManager/tableTypes";

  export let cell: CellData;

  const onClickHandler = (e: MouseEvent) => {
    console.log("TableTd.onClickHandler", e);
    e.stopPropagation()
  }
</script>
<td>
  <div class="cell" on:click={e=>onClickHandler(e)}>
    <span>{cell.value}</span>
  </div>
</td>

<style lang="scss">

  td {
    border: 1px solid gray;

    div.cell {
      width: 100%;
      height: 100%;
      cursor: pointer;


      &.disabled {
        cursor: not-allowed;
      }
    }
  }
</style>