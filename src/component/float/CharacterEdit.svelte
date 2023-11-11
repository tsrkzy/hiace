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
  import { createAlias, updateAlias } from "../../model/service/AliasService";
  import { useRoom } from "../../model/store/room";
  import { useImageSources } from "../../model/store/imageSources";
  import { updateCharacter } from "../../model/service/CharacterService";
  import ImageTileSelector from "../image/ImageTileSelector.svelte";
  import ImageUploadButton from "../button/ImageUploadButton.svelte";
  import AliasSelector from "../AliasSelector.svelte";
  import InputText from "../input/InputText.svelte";
  import TextArea from "../input/TextArea.svelte";
  import Checkbox from "../input/Checkbox.svelte";
  import ColorPicker from "../input/ColorPicker.svelte";

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

  let aliasIdSelected = character?.activeAlias;
  $: aliasSelected = characterAliases.find(a => a.id === character?.activeAlias);

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
      return;
    }
    await updateCharacter({ characterId, criteria: { name: newCharacterName } })
  }

  const onBlurCharacterText = async (e: Event) => {
    console.log("CharacterEdit.onBlurCharacterText");
    const target = e.target as HTMLTextAreaElement;
    const text = target.value.trim();
    if (text === characterText) {
      return;
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

  const onChangeAlias = async (e: Event) => {
    console.log("CharacterEdit.onChangeAlias");
    const target = e.target as HTMLSelectElement;
    const _aliasId = target.value;
    if (!_aliasId) {
      return;
    }
    aliasIdSelected = _aliasId;
  }

  const onChangeAliasImage = async (e: Event, aliasId: string|undefined) => {
    console.log("CharacterEdit.onChangeAliasImage");
    if (!aliasId) {
      return;
    }
    const { value: imageId } = e.target as HTMLInputElement;
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
{#if character}
  <fieldset>
    <legend>キャラクタの設定</legend>
    <div>
      <InputText
          label="名前"
          value={characterName}
          onBlur={(e)=>onBlurCharacterName(e)}
      ></InputText>
    </div>
    <div>
      <TextArea
          placeholder="キャラクタ説明"
          value={characterText}
          onBlur={(e)=>onBlurCharacterText(e)}
      ></TextArea>
    </div>
    <div>
      <Checkbox
          label="データテーブルに表示する"
          checked={isShowOnInitiative}
          onChange={onChangeCharacterShowOnInitiative}
      ></Checkbox>
    </div>
    <div>
        <ColorPicker
            label="チャット色"
            value={characterColor}
            onChange={onChangeCharacterColor}
        ></ColorPicker>
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
  </fieldset>
  <fieldset>
    <legend>立絵の選択</legend>
    <Button handle={()=>onAddAlias(characterId)}>立絵の追加</Button>
    {#each characterAliases as alias (alias.id)}
      <AliasSelector
          alias={alias}
          name={`active-alias-picker_float-${floatId}`}
          character={character}
          onChange={onChangeActiveAlias}
      ></AliasSelector>
    {/each}
  </fieldset>
  <fieldset>
    <legend>立絵の画像割当</legend>
    <select on:change={(e)=>onChangeAlias(e)}>
      {#each characterAliases as a (a.id)}
        <option value={a.id} selected={a.id === aliasIdSelected}>{a.name}</option>
      {/each}
    </select>
    <ImageUploadButton></ImageUploadButton>
    <div class="image-chip__container">
      {#each $imageSources as imgSrc (imgSrc.id)}
        <ImageTileSelector
            imageSource={imgSrc}
            name={`character-edit_alias-image_float-${floatId}`}
            checkedId={aliasSelected?.image}
            onChange={(e)=>onChangeAliasImage(e, aliasSelected?.id)}
        ></ImageTileSelector>
      {/each}
    </div>
  </fieldset>
{/if}


<style lang="scss">
  .image-chip__container {
    display: flex;
    flex-wrap: wrap;
  }

</style>