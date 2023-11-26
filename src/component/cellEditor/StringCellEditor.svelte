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

  const { cellEditorTarget, setShowCellEditor } = useTables()
  const { columns } = useColumns()

  const onKeyDown = async (e: KeyboardEvent) => {
    if (!$cellEditorTarget) {
      return;
    }

    const column = $columns.find(c => c.id === $cellEditorTarget?.cellData.columnId);
    if (!column) {
      return;
    }

    // 空文字だったら無視
    const target = e.target as HTMLInputElement;
    const value = target.value?.trim();
    if (!value) {
      return;
    }

    // 変換中は無視
    if (e.isComposing) {
      return
    }
    // enterキーとnumpadEnterキーのみ受け付ける
    if (e.key !== "Enter" && e.key !== "NumpadEnter") {
      return;
    }

    const { dataMap = {} } = column;
    dataMap[$cellEditorTarget.cellData.characterId] = value;

    await updateColumn({
      columnId: $cellEditorTarget.cellData.columnId,
      criteria: { dataMap }
    })
    setShowCellEditor(false)
  }
</script>


<input
    id={CELL_EDITOR_INPUT_ID}
    type="text"
    value={$cellEditorTarget?.cellData.value}
    on:keydown={e=>onKeyDown(e)}
/>
<p>Enterで適用</p>