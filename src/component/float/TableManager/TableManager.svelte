<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useTables } from "@/model/store/tables";
  import TableView from "@/component/float/TableManager/TableView.svelte";
  import { useColumns } from "@/model/store/columns";
  import InputText from "@/component/input/InputText.svelte";
  import Button from "@/component/button/Button.svelte";
  import { Column, type ColumnDataType, ColumnDataTypes } from "@/model/Column";
  import { createColumn, deleteColumn, updateColumn } from "@/model/service/ColumnService";
  import { useRoom } from "@/model/store/room";

  const { room } = useRoom();
  const { tables } = useTables()
  const { columns } = useColumns()

  $: columnSorted = $columns.sort((a, b) => a.order - b.order);

  let tableId = $tables[0]?.id || "";

  const onClickDeleteColumn = async (columnId: string) => {
    await deleteColumn({ columnId })
  }
  const onBlurColumnName = async (e: Event, column: Column) => {
    console.log("TableManager.onBlurColumnName", e);
    const target = e.target as HTMLInputElement;
    const newColumnName = (target.value || "").trim();
    if (!newColumnName || newColumnName === column.label) {
      target.value = column.label;
      return;
    }
    await updateColumn({ columnId: column.id, criteria: { label: newColumnName } });
  }

  const onClickAddColumn = async (dataType: ColumnDataType) => {
    console.log("TableManager.onClickAddColumn", dataType);
    await createColumn({
      roomId: $room.id,
      tableId,
      label: "新しい項目",
      dataType,
      order: $columns.length,
    })
  }
</script>

<TableView {tableId} debug={false}></TableView>
<details open>
  <summary>項目の追加と編集</summary>
  <table>
    <thead>
    <tr>
      <th>項目名</th>
      <th>データ型</th>
      <th>操作</th>
    </tr>
    </thead>
    <tbody>
    {#each columnSorted as column(column.id)}
      <tr>
        <td>
          <InputText label="" value={column.label} onBlur={e=>onBlurColumnName(e, column)}></InputText>
        </td>
        <td>
          {column.dataType}
        </td>
        <td>
          <Button handle={()=>onClickDeleteColumn( column.id)}>削除</Button>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
  <Button handle={()=>onClickAddColumn(ColumnDataTypes.STR)}>テキスト</Button>
  <Button handle={()=>onClickAddColumn(ColumnDataTypes.INT)}>数値</Button>
  <Button handle={()=>onClickAddColumn(ColumnDataTypes.BOOL)}>チェックボックス</Button>
</details>
