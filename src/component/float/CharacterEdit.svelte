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
  import { createAlias, deleteAlias, updateAlias } from "../../model/service/AliasService";
  import { useRoom } from "../../model/store/room";
  import { useImageSources } from "../../model/store/imageSources";
  import { updateCharacter } from "../../model/service/CharacterService";

  export let float: Float = {} as Float;

  const { characters } = useCharacters()
  const { aliases } = useAliases()
  const { room } = useRoom()
  const { imageSources } = useImageSources()

  $: floatId = float?.id;

  let characterId = float?.args?.characterId || "";
  $: character = $characters.find(c => c.id === characterId);
  $: characterName = character?.name || "";
  $: characterText = character?.text || "";
  $: isShowOnInitiative = !!(character?.showOnInitiative);
  $: characterColor = character?.color || "#000000";
  $: characterAliases = (() => {
    return $aliases.filter(a => a.character === characterId)
  })()
  $: aliasImageSources = (() => {
    return $imageSources.filter(i => characterAliases.some(a => a.image === i.id))
  })()

  const getAliasImage = (imageId: string) => {
    return aliasImageSources.find(i => i.id === imageId)
  }

  const onChangeCharacter = async (e: Event) => {
    console.log("CharacterEdit.onChangeCharacter");
    const target = e.target as HTMLSelectElement;
    const _characterId = target.value;
    if (!_characterId) {
      return false;
    }
    characterId = _characterId;
  }

  const onBlurCharacterName = async (e: Event) => {
    console.log("CharacterEdit.onBlurCharacterName");
    const target = e.target as HTMLInputElement;
    const newCharacterName = target.value.trim();
    if (!newCharacterName) {
      target.value = characterName;
      return false;
    }
    await updateCharacter({ characterId, criteria: { name: newCharacterName } })
  }

  const onBlurCharacterText = async (e: Event) => {
    console.log("CharacterEdit.onBlurCharacterText");
    const target = e.target as HTMLTextAreaElement;
    const text = target.value.trim();
    if (text === characterText) {
      return false;
    }
    await updateCharacter({ characterId, criteria: { text } })
  }

  const onChangePawnSize = async (e: Event) => {
    console.log("CharacterEdit.onChangePawnSize");
    const target = e.target as HTMLSelectElement;
    const pawnSize = parseInt(target.value, 10);
    await updateCharacter({ characterId, criteria: { pawnSize } })
  }

  const onChangeCharacterShowOnInitiative = async (e: Event) => {
    console.log("CharacterEdit.onChangeCharacterShowOnInitiative");
    const target = e.target as HTMLInputElement;
    const showOnInitiative = !!(target.checked);
    await updateCharacter({ characterId, criteria: { showOnInitiative } })
  }

  const onChangeChatPosition = async (e: Event) => {
    console.log("CharacterEdit.onChangeChatPosition");
    const target = e.target as HTMLInputElement;
    const chatPosition = parseInt(target.value, 10);
    if (chatPosition === character?.chatPosition) {
      return false;
    }
    await updateCharacter({ characterId, criteria: { chatPosition } })
  }
  const onAddAlias = async (characterId: string) => {
    console.log("CharacterEdit.onAddAlias", characterId);
    await createAlias({
      roomId: $room.id,
      characterId,
      name: `立絵_${characterAliases.length + 1}`,
    })
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
      return false;
    }
    await updateAlias({ aliasId, criteria: { name } })
  }

</script>


<p>floatId: {floatId}</p>
<p>characterId: {characterId}</p>
<!-- キャラクター選択 -->
<select on:change={(e)=>onChangeCharacter(e)}>
  {#each $characters as c (c.id)}
    <option value={c.id} selected={c.id === character?.id}>{c.name}</option>
  {/each}
</select>
<fieldset>
  <legend>キャラクタの設定</legend>
  <div>
    <label>
      <span>名前</span>
      <input type="text" value={characterName}
             on:blur={(e)=>onBlurCharacterName(e)}>
    </label>
  </div>
  <div>
    <textarea
        placeholder="キャラクタ説明"
        value={characterText}
        on:blur={(e)=>onBlurCharacterText(e)}
    ></textarea>
  </div>
  <div>
    <label>
      <input
          type="checkbox"
          checked={isShowOnInitiative}
          on:change={(e)=>onChangeCharacterShowOnInitiative(e)}>
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
      <select on:change={(e)=>onChangePawnSize(e)}>
        {#each [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as size}
          <option selected={character?.pawnSize === size} value={size}>x{size}</option>
        {/each}
      </select>
    </label>
  </div>
  <field>
    <legend>立ち絵</legend>
    <div>
      <label>
        <span>表示位置</span>
        <input
            type="range"
            min="0"
            max="11"
            step="1"
            value={character?.chatPosition}
            on:change={(e)=>onChangeChatPosition(e)}
        >
      </label>
    </div>
    <div>
      <Button handle={()=>onAddAlias(characterId)}>立絵の追加</Button>
    </div>
    <div class="image-containter">
      {#each characterAliases as alias (alias.id)}
        <div class="alias-image__chip">
          {#if getAliasImage(alias.image)}
            <img src={getAliasImage(alias.image)?.url}
                 alt={alias.name}>
          {/if}
        </div>
        <Button handle={()=>onClickDeleteAlias(alias.id)}>削除</Button>
        <input type="text" value={alias.name} on:blur={(e)=>onBlurAliasName(e, alias.id, alias.name)}/>
      {/each}
    </div>
  </field>
</fieldset>

<style lang="scss">
  div.alias-image__chip {
    width: 48px;
    height: 48px;
    border: 1px solid #000000;

    & img {
      width: 100%;
      height: 100%;
    }
  }

</style>