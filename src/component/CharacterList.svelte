<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { onDestroy } from "svelte";
  import { Character } from "../model/Character";
  import { useCharacters } from "../model/store/characters";

  const { subscribeCharacters } = useCharacters()

  $: characters = [] as Character[];
  const subscribes: (() => unknown)[] = [];
  subscribes.push(subscribeCharacters((_characters: Character[]) => {
    characters = _characters
  }))
  onDestroy(() => {
    subscribes.forEach(s => s());
  })
</script>

<main>
  {#each characters as c}
    <ul>
      <li>{c.Id},{c.Name}</li>
    </ul>
  {/each}
</main>