<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import Backdrop from "@/component/Backdrop.svelte";
  import CellEditor from "@/component/cellEditor/CellEditor.svelte";
  import { useTables } from "@/model/store/tables";

  const { showCellEditor } = useTables()
</script>
<Backdrop show={$showCellEditor}>
  <CellEditor></CellEditor>
</Backdrop>