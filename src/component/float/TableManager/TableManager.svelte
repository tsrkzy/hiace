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
  import { type ColumnDataType,ColumnDataTypes } from "@/model/Column";

  const { tables } = useTables()
  const { columns } = useColumns()

  let tableId = $tables[0]?.id || "";

  const onClickDeleteColumn = async (e: Event) => {
    console.log("TableManager.onClickDeleteColumn");
    e.stopPropagation();
  }
  const onBlurColumnName = async (e: Event) => {
    console.log("TableManager.onBlurColumnName", e);
    const target = e.target as HTMLInputElement;
    const newColumnName = target.value;
    console.log(newColumnName);
  }

  const onClickAddColumn = async (dataType: ColumnDataType) => {
    console.log("TableManager.onClickAddColumn", dataType);
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
    {#each $columns as column(column.id)}
      <tr>
        <td>
          <InputText label="" value={column.label} onBlur={e=>onBlurColumnName(e)}></InputText>
        </td>
        <td>
          {column.dataType}
        </td>
        <td>
          <button on:click={(e) => onClickDeleteColumn(e)}>削除</button>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
  <Button handle={()=>onClickAddColumn(ColumnDataTypes.STR)}>テキスト</Button>
  <Button handle={()=>onClickAddColumn(ColumnDataTypes.INT)}>数値</Button>
  <Button handle={()=>onClickAddColumn(ColumnDataTypes.BOOL)}>チェックボックス</Button>
</details>
