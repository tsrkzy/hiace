<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useCharacters } from "../../model/store/characters";
  import { useAliases } from "../../model/store/aliases";
  import { Float } from "../../model/Float";

  export const float = {} as Float

  const { characters } = useCharacters();
  const { aliases } = useAliases()
</script>
<ul>

  {#each $characters as c (c.id)}
    <li>{c.name} (#{c.id})</li>
    <ul>
      {#each $aliases as a (a.id)}
        {#if a.character === c.id}
          <li>{a.name} (#{a.id})</li>
        {/if}
      {/each}
    </ul>
  {/each}
</ul>
