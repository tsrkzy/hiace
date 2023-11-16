<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">

  import { useImageSources } from "@/model/store/imageSources";
  import { Alias } from "@/model/Alias";
  import { Character } from "@/model/Character";
  import { deleteAlias, updateAlias } from "@/model/service/AliasService";
  import ImageTile from "@/component/image/ImageTile.svelte";
  import Button from "@/component/button/Button.svelte";

  const { imageSources } = useImageSources();

  export let name: string;
  export let alias: Alias;
  export let character: Character;
  export let onChange: (e: Event) => void|Promise<void>;

  $: checked = alias.id === character.activeAlias

  const getAliasImage = (imageId: string) => {
    return $imageSources.find(i => i.id === imageId)
  }

  const onClickDeleteAlias = async (aliasId: string) => {
    console.log("CharacterEdit.onClickDeleteAlias", aliasId);
    await deleteAlias({ aliasId })
  }

  const onBlurAliasName = async (e: Event, aliasId: string, aliasName: string) => {
    console.log("CharacterEdit.onBlurAliasName", aliasId);
    const target = e.target as HTMLInputElement;
    const name = target.value.trim();
    if (!name) {
      target.value = aliasName;
      return;
    }
    await updateAlias({ aliasId, criteria: { name } })
  }


</script>

<div class={`alias-editor ${checked?"checked":""}`}>
  <input
      type="text"
      value={alias.name}
      on:blur={(e)=>onBlurAliasName(e, alias.id, alias.name)}/>
  <label>
    {#if checked}
      <span>(選択中)</span>
    {/if}
    <input type="radio"
           name={name}
           value={alias.id}
           checked={checked}
           on:change={(e)=>onChange(e)}
    >
    <ImageTile url={getAliasImage(alias.image)?.url}
               alt={alias.name}></ImageTile>
  </label>
  <Button handle={()=>onClickDeleteAlias(alias.id)}>削除</Button>
</div>

<style lang="scss">

  label {
    cursor: pointer;
  }

  input[type="radio"] {
    display: none;
  }

</style>