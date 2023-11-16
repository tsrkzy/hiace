<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { CHARACTER_ID_NULL } from "@/constant";
  import { ALIAS_ID_NULL } from "@/constant.js";
  import { Alias } from "@/model/Alias";
  import { useCharacters } from "@/model/store/characters";

  export let characterAliases: Alias[];
  export let characterId: string = CHARACTER_ID_NULL;

  const { characters } = useCharacters()
  $: character = $characters.find((c) => c.id === characterId);
  const dispatcher = createEventDispatcher<{ changeAliasId: string }>();

  const onChangeAlias = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value;
    dispatcher("changeAliasId", value)
  }
</script>

<select on:change={(e)=>onChangeAlias(e)}>
  <option value={ALIAS_ID_NULL} disabled selected={characterId==="NULL"}>立絵</option>
  {#each characterAliases as alias (alias.id)}
    <option value={alias.id} selected={alias.id===character?.activeAlias}>{alias.name}</option>
  {/each}
</select>