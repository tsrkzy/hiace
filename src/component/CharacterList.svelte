<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { onDestroy } from "svelte";
  import { Character } from "../model/Character";
  import { Alias } from "../model/Alias";
  import { useCharacters } from "../model/store/characters";
  import { useAliases } from "../model/store/aliases";

  const { subscribeCharacters } = useCharacters()
  const { subscribeAliases } = useAliases()

  let characters = [] as Character[];
  let aliases = [] as Alias[];

  const subscribes: (() => unknown)[] = [];

  subscribes.push(subscribeCharacters((_characters: Character[]) => {
    characters = _characters
  }))
  subscribes.push(subscribeAliases((_aliases: Alias[]) => {
    aliases = _aliases
  }))

  onDestroy(() => {
    subscribes.forEach(s => s());
  })

  const handleAddCharacter = ()=>{
    console.log("CharacterList.handleAddCharacter");
  }
</script>

<main>
  <h2>Character</h2>
  {#each characters as c}
    <ul>
      <li>{c.id},{c.name}</li>
    </ul>
  {/each}
  <button on:click={handleAddCharacter}>add character</button>
  <h2>Alias</h2>
  {#each aliases as a}
    <ul>
      <li>{a.id},{a.name}</li>
    </ul>
  {/each}
</main>