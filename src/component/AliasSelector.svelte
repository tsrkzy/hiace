<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Alias } from "../model/Alias";
  import { Character } from "../model/Character";
  import ImageTile from "./image/ImageTile.svelte";
  import { useImageSources } from "../model/store/imageSources";

  const { imageSources } = useImageSources();

  export let name: string;
  export let alias: Alias;
  export let character: Character;
  export let onChange: (e: Event) => void|Promise<void>;

  const getAliasImage = (imageId: string) => {
    return $imageSources.find(i => i.id === imageId)
  }

</script>

<label>
  <input type="radio"
         name={name}
         value={alias.id}
         checked={alias.id === character.activeAlias}
         on:change={(e)=>onChange(e)}
  >
  {#if getAliasImage(alias.image)}
    <ImageTile url={getAliasImage(alias.image)?.url}
               alt={alias.name}></ImageTile>
  {:else }
    <span>画像未設定</span>
  {/if}
</label>