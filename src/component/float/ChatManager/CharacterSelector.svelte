<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { Character } from "@/model/Character";
  import { CHARACTER_ID_NULL } from "@/constant";
  import { useAuth } from "@/model/store/auth";

  export let characters: Character[];
  export let characterId: string = CHARACTER_ID_NULL;
  const { email } = useAuth();

  const dispatcher = createEventDispatcher<{ changeCharacterId: string }>();

  const onChangeCharacter = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value;
    dispatcher("changeCharacterId", value)
  }
</script>
<select on:change={(e)=>onChangeCharacter(e)}>
  <option value={CHARACTER_ID_NULL} selected={characterId === CHARACTER_ID_NULL}>{$email}(PL)</option>
  {#each characters as character (character.id)}
    <option value={character.id} selected={character.id === characterId}>{character.name}</option>
  {/each}
</select>