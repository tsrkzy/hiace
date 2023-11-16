<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">
  import { Float } from "@/model/Float";
  import ChatLogViewer from "@/component/chat/ChatLogViewer.svelte";
  import Checkbox from "@/component/input/Checkbox.svelte";
  import Button from "@/component/button/Button.svelte";
  import { useCharacters } from "@/model/store/characters";
  import { useUsers } from "@/model/store/users";
  import { useAliases } from "@/model/store/aliases";
  import { useChannels } from "@/model/store/channels";
  import { ALIAS_ID_NULL, CHANNEL_ID_NULL, CHARACTER_ID_NULL } from "@/constant";
  import CharacterSelector from "@/component/float/ChatManager/CharacterSelector.svelte";
  import AliasSelector from "@/component/float/ChatManager/AliasSelector.svelte";
  import ChannelSelector from "@/component/float/ChatManager/ChannelSelector.svelte";

  export let float = {} as Float;


  let characterId = CHARACTER_ID_NULL;
  let aliasId = ALIAS_ID_NULL;
  let channelId = CHANNEL_ID_NULL

  const { myUserId } = useUsers();
  const { characters } = useCharacters();
  const { aliases } = useAliases();
  const { channels } = useChannels();

  $: myCharacters = $characters.filter((c) => c.owner === $myUserId);
  $: myCharacterAliases = $aliases.filter((a) => a.character === characterId);


  const onChangeCharacter = (e: CustomEvent<string>) => {
    console.log("ChatManager.onChangeCharacter");
    characterId = e.detail;
    const character = $characters.find((c) => c.id === characterId);
    aliasId = character?.activeAlias || ALIAS_ID_NULL;
  }
  const onChangeAlias = (e: CustomEvent<string>) => {
    console.log("ChatManager.onChangeAlias", e);
    aliasId = e.detail;
    console.log(aliasId);
  }

  const onChangeChannel = (e: CustomEvent<string>) => {
    console.log("ChatManager.onChangeChannel", e);
    channelId = e.detail;
  }

  const onChangeShowAlias = (e: Event) => {
    console.log("ChatManager.onChangeShowAlias", e);
  };
</script>


<ChatLogViewer floatId={float.id}></ChatLogViewer>
<fieldset>
  <legend>チャット設定</legend>
  <div style="white-space: nowrap">
    <CharacterSelector
        characters={myCharacters}
        characterId={characterId}
        on:changeCharacterId={e=>onChangeCharacter(e)}
    ></CharacterSelector>
    <AliasSelector
        characterAliases={myCharacterAliases}
        characterId={characterId}
        on:changeAliasId={e=>onChangeAlias(e)}
    ></AliasSelector>
    <ChannelSelector
        channels={$channels}
        channelId={channelId}
        on:changeChannelId={e=>onChangeChannel(e)}
    ></ChannelSelector>
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