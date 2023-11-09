<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">

  import { useCharacters } from "../../model/store/characters";
  import { Float } from "../../model/Float";
  import { useAliases } from "../../model/store/aliases";
  import Button from "../button/Button.svelte";

  export let float: Float = {} as Float;

  const { characters } = useCharacters()
  const { aliases } = useAliases()

  $: floatId = float?.id;

  let characterId = float?.args?.characterId || "";

  $: character = $characters.find(c => c.id === characterId);
  $:characterName = character?.name || "";
  $:characterText = character?.text || "";
  $:isShowOnInitiative = !!(character?.showOnInitiative);
  $:characterColor = character?.color || "#000000";
  $: characterAliases = (() => {
    return $aliases.filter(a => a.character === characterId)
  })()
  const onAddAlias = async (characterId: string) => {
    console.log("CharacterEdit.onAddAlias", characterId);
    if (characterId) {
      return false;
    }
  }

</script>


<p>floatId: {floatId}</p>
<p>characterId: {characterId}</p>
<!-- キャラクター選択 -->
<select>
  {#each $characters as c (c.id)}
    <option value={c.id} selected={c.id === character?.id}>{c.name}</option>
  {/each}
</select>
<fieldset>
  <legend>キャラクタの設定</legend>
  <div>
    <label>
      <input type="text" bind:value={characterName}>
      <span>名前</span>
    </label>
  </div>
  <div>
    <textarea
        placeholder="キャラクタ説明"

        value={characterText}></textarea>
  </div>
  <div>
    <label>
      <input type="checkbox" checked={isShowOnInitiative}>
      <span>データテーブルに表示する</span>
    </label>
  </div>
  <div>
    <label>
      <input type="color" bind:value={characterColor}>
      <span>チャット色</span>
    </label>
  </div>
  <div>
    <label>
      <span>コマの大きさ</span>
      <select>
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
    </label>
  </div>
  <field>
    <legend>立ち絵</legend>
    <div>
      <label>
        <span>表示位置</span>
        <input type="range" min="0" max="11" step="1">
      </label>
    </div>
    <div>
      <Button handle={()=>onAddAlias(characterId)}></Button>
    </div>
    <ul>
      {#each characterAliases as alias (alias.id)}
        <li>
          <div>
            <img src={alias.image} alt={alias.name}><span>{alias.name}</span>
          </div>
          <div>
          </div>
        </li>
      {/each}
    </ul>
  </field>
</fieldset>