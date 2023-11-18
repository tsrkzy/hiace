<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { GAME_SYSTEMS } from "@/util/diceBot.js";
  import { createEventDispatcher } from "svelte";

  export let gameSystem: string;

  const dispatch = createEventDispatcher<{ changeGameSystem: string }>();

  const onChangeSelect = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    gameSystem = target.value;
    dispatch("changeGameSystem", gameSystem);
  }
</script>

<select on:change={e=>onChangeSelect(e)}>
  {#each GAME_SYSTEMS as system}
    <option selected={system.id===gameSystem} value={system.id}>{system.name}</option>
  {/each}
  <option>ダイス</option>
</select>