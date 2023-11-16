<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { Float } from "@/model/Float";
  import { useBoards } from "@/model/store/boards";
  import BoardEditor from "./BoardEditor.svelte";

  export const float = {} as Float;

  const { boards } = useBoards();
</script>

{#each $boards as b (b.id)}
  <BoardEditor board={b}></BoardEditor>
{/each}

