<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Float } from "@/model/Float";
  import { useTables } from "@/model/store/tables";
  import TableView from "@/component/float/TableManager/TableView.svelte";

  export let float: Float;

  const { tables } = useTables()

  let tableId = "";

  const onChangeTable = (e: Event) => {
    const target = e.target as HTMLSelectElement
    tableId = target.value
  }
</script>

<select on:change={(e)=>onChangeTable(e)}>
  <option value="" selected disabled>テーブルを選択</option>
  {#each $tables as t(t.id)}
    <option value={t.id}>{t.name}</option>
  {/each}
</select>
<TableView {tableId}></TableView>