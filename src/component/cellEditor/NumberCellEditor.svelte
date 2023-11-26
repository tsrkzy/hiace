<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { updateColumn } from "@/model/service/ColumnService";
  import { CELL_EDITOR_INPUT_ID } from "@/constant.js";
  import { useTables } from "@/model/store/tables";
  import { useColumns } from "@/model/store/columns";

  let errorText = "";
  const {
    cellEditorTarget
    , setShowCellEditor
  } = useTables()
  const { columns } = useColumns()

  const onKeyDown = async (e: KeyboardEvent) => {
    console.log("NumberCellEditor.onKeyDown");
    if (!$cellEditorTarget) {
      return;
    }

    const column = $columns.find(c => c.id === $cellEditorTarget?.cellData.columnId);
    if (!column) {
      return;
    }

    // 変換中は無視
    if (e.isComposing) {
      return
    }

    const target = e.target as HTMLInputElement;
    const value = target.value?.trim();

    // enterキーとnumpadEnterキーのみ受け付ける
    if (e.key !== "Enter" && e.key !== "NumpadEnter") {
      return;
    }

    errorText = validateNumberString(value)
    if (errorText) {
      console.warn(errorText);
      return;
    }

    const num = parseInt(value, 10);

    const { dataMap = {} } = column;
    dataMap[$cellEditorTarget.cellData.characterId] = num;

    await updateColumn({
      columnId: $cellEditorTarget.cellData.columnId,
      criteria: { dataMap }
    })
    setShowCellEditor(false)
  }

  const validateNumberString = (_value: string): string => {
    const value = _value.trim();
    if (!value) {
      return "空文字は指定できません"
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      return "数値を入力してください"
    }

    // 少数は指定不可とする
    if (value.includes(".")) {
      return "小数は指定できません"
    }

    return "";
  }
</script>


<input
    id={CELL_EDITOR_INPUT_ID}
    type="number"
    value={$cellEditorTarget?.cellData.value}
    on:keydown={e=>onKeyDown(e)}
/>
<p>Enterで適用</p>
{#if errorText}
  <pre class="error">正負の整数および0のみが指定できます</pre>
{/if}

<style lang="scss">
  pre.error {
    color: darkred;
  }
</style>