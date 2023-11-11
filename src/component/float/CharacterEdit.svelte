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
  import ImageTile from "../image/ImageTile.svelte";

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

  let aliasIdSelected = character?.activeAlias;
  $: aliasSelected = characterAliases.find(a => a.id === character?.activeAlias);

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

  const onChangeCharacterColor = async (e: Event) => {
    console.log("CharacterEdit.onChangeCharacterColor");
    const target = e.target as HTMLInputElement;
    const color = target.value || "#000000"
    console.log("target.value", target.value);
    await updateCharacter({ characterId, criteria: { color } })
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

  export const onChangeActiveAlias = async (e: Event) => {
    console.log("CharacterEdit.onChangeActiveAlias");
    const target = e.target as HTMLInputElement;
    const activeAlias = target.value;
    await updateCharacter({ characterId, criteria: { activeAlias } })
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

  const onChangeAlias = async (e: Event) => {
    console.log("CharacterEdit.onChangeAlias");
    const target = e.target as HTMLSelectElement;
    const _aliasId = target.value;
    if (!_aliasId) {
      return false;
    }
    aliasIdSelected = _aliasId;
  }

  const onChangeAliasImage = async (e: Event, aliasId: string|undefined) => {
    console.log("CharacterEdit.onChangeAliasImage");
    if (!aliasId) {
      return false;
    }
    const target = e.target as HTMLInputElement;
    const imageId = target.value;
    await updateAlias({ aliasId, criteria: { image: imageId } })
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
      {characterColor}
      <input type="color" value={characterColor}
             on:change={(e)=>onChangeCharacterColor(e)}
      >
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
      <fieldset>
        <input
            type="text"
            value={alias.name}
            on:blur={(e)=>onBlurAliasName(e, alias.id, alias.name)}/>
        <div>
          <label>
            <input type="radio"
                   name={`active-alias-picker_float-${floatId}`}
                   value={alias.id}
                   checked={alias.id === character?.activeAlias}
                   on:change={(e)=>onChangeActiveAlias(e)}>
            <div class="alias-image__chip">
              {#if getAliasImage(alias.image)}
                <ImageTile url={getAliasImage(alias.image)?.url}
                           alt={alias.name}></ImageTile>
              {/if}
            </div>
          </label>
        </div>
        <Button handle={()=>onClickDeleteAlias(alias.id)}>削除</Button>
      </fieldset>
    {/each}
  </div>
</fieldset>
<fieldset>
  <select on:change={(e)=>onChangeAlias(e)}>
    {#each characterAliases as a (a.id)}
      <option value={a.id} selected={a.id === aliasIdSelected}>{a.name}</option>
    {/each}
  </select>

  <div class="image-chip__container">
    {aliasSelected?.image}
    {#each $imageSources as imgSrc (imgSrc.id)}
      <label>
        <input type="radio"
               name={`character-edit_alias-image_float-${floatId}`}
               value={imgSrc.id}
               checked={aliasSelected?.image===imgSrc.id}
               on:change={(e)=>onChangeAliasImage(e, aliasSelected?.id)}
        />
        <ImageTile url={imgSrc.url}></ImageTile>
      </label>
    {/each}
  </div>
</fieldset>

<style lang="scss">
  .image-chip__container {
    display: flex;
    flex-wrap: wrap;
  }

</style>