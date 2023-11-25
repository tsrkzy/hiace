<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { type ColData } from "@/component/float/TableManager/tableTypes";

  export let col: ColData

  const onClickHandler = (e: MouseEvent) => {
    console.log("TableTh.onClickHandler", e);
    e.stopPropagation();
  }

  const onClickOrderColumn = (e: MouseEvent, id: string, direction: "left"|"right") => {
    console.log("TableTh.onClickOrderColumn", e, id, direction);
    e.stopPropagation();
  }
</script>

<th class="column--header">
  <div class={`col ${col.system?"disabled":""}`} on:click={e=>onClickHandler(e)}>
    {#if !col.system}
      <span class="left" on:click={e=>onClickOrderColumn(e, col.id, "left")}>◀</span>
    {/if}
    {#if !col.system}
      <span class="right" on:click={e=>onClickOrderColumn(e, col.id , "right")}>▶</span>
    {/if}
    <span>{col.label}</span>
  </div>
</th>

<style lang="scss">

  th {
    border: 1px solid gray;

    div.col {
      position: relative;
      width: 100%;
      min-width: 35px;
      height: 100%;
      font-weight: bold;
      cursor: pointer;

      &.disabled {
        cursor: not-allowed;
      }

      span {
        &.left, &.right {
          position: absolute;
          display: none;
          width: 1.0rem;
          opacity: 0.3;

          &:hover {
            opacity: 1;
          }
        }

        &.left {
          left: 0;
        }

        &.right {
          right: 0;
        }
      }

      &:hover {
        span {
          display: block;
        }
      }
    }

    &.column--header {
      border: 1px solid gray;
      background-color: lightcyan;
    }
  }
</style>