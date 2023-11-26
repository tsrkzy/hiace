<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">

  import { useContextMenu } from "@/model/store/contextMenu";
  import ContextMenuAccordion from "@/component/contextMenu/ContextMenuAccordion.svelte";
  import Backdrop from "@/component/Backdrop.svelte";

  const {
    showContextMenu,
    contextMenuItems,
  } = useContextMenu()

</script>

<Backdrop show={$showContextMenu}>
  <ContextMenuAccordion level={0} children={$contextMenuItems}></ContextMenuAccordion>
</Backdrop>

