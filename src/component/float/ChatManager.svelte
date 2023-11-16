<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { Float } from "../../model/Float";
  import ChatLogViewer from "../chat/ChatLogViewer.svelte";
  import Checkbox from "../input/Checkbox.svelte";
  import Button from "../button/Button.svelte";
  import { useAuth } from "../../model/store/auth";
  import { useCharacters } from "../../model/store/characters";
  import { useUsers } from "../../model/store/users";
  import { useAliases } from "../../model/store/aliases";
  import { useChannels } from "../../model/store/channels";

  export let float = {} as Float;

  const CHARACTER_ID_NULL = "NULL";
  const ALIAS_ID_NULL = "NULL";
  let characterId = CHARACTER_ID_NULL;
  let aliasId = ALIAS_ID_NULL;

  const { email } = useAuth()
  const { myUserId } = useUsers();
  const { characters } = useCharacters();
  const { aliases } = useAliases();
  const { channels } = useChannels();

  $: myCharacters = $characters.filter((c) => c.owner === $myUserId);
  $: character = $characters.find((c) => c.id === characterId);
  $: myCharacterAliases = $aliases.filter((a) => a.character === characterId);


  const onChangeCharacter = (e: Event) => {
    console.log("ChatManager.onChangeCharacter", e);
    const { value } = e.currentTarget as HTMLSelectElement;
    characterId = value;
    const character = $characters.find((c) => c.id === characterId);
    aliasId = character?.activeAlias || ALIAS_ID_NULL;
  }
  const onChangeAlias = (e: Event) => {
    console.log("ChatManager.onChangeAlias", e);
  }
  const onChangeShowAlias = (e: Event) => {
    console.log("ChatManager.onChangeShowAlias", e);
  };
</script>


<ChatLogViewer floatId={float.id}></ChatLogViewer>
<fieldset>
  <legend>チャット設定</legend>
  {characterId} {aliasId}
  <div style="white-space: nowrap">
    <select on:change={(e)=>onChangeCharacter(e)}>
      <option value={CHARACTER_ID_NULL}>{$email}(PL)</option>
      {#each myCharacters as character (character.id)}
        <option value={character.id}>{character.name}</option>
      {/each}
    </select>
    <select on:change={(e)=>onChangeAlias(e)}>
      <option value={ALIAS_ID_NULL} disabled selected={characterId==="NULL"}>立絵</option>
      {#each myCharacterAliases as alias (alias.id)}
        <option value={alias.id} selected={alias.id===character?.activeAlias}>{alias.name}</option>
      {/each}
    </select>
    <select>
      <option value="NULL" selected>チャンネル</option>
      {#each $channels as channel (channel.id)}
        <option value={channel.id}>{channel.name}</option>
      {/each}
    </select>
    <select>
      <option>ダイス</option>
    </select>
    <Checkbox
        label="立絵の表示"
        checked
        onChange={(e) => onChangeShowAlias(e)}
    ></Checkbox>
    <Button>+</Button>
    <Button>-</Button>
  </div>
  <div>
    <textarea
        class="chat-list__textarea-wrapper"
        rows="2"
        placeholder="enter: send / shift+enter: new line / arrow up: dice log"
    ></textarea>
  </div>
</fieldset>
<style>
    textarea.chat-list__textarea-wrapper {
        width: 100%;
        height: 100%;
        resize: none;
    }
</style>