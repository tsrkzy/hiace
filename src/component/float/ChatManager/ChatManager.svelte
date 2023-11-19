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
  import ChatEditor from "@/component/float/ChatManager/ChatEditor.svelte";
  import { useRoom } from "@/model/store/room";
  import DiceSelector from "@/component/float/ChatManager/DiceSelector.svelte";
  import AliasDisplay from "@/component/float/ChatManager/AliasDisplay.svelte";
  import { setActiveAlias } from "@/model/service/CharacterService";


  export let float = {} as Float;


  const { myUserId } = useUsers();
  const { characters } = useCharacters();
  const { aliases } = useAliases();
  const { channels } = useChannels();
  const { room } = useRoom()

  let characterId = CHARACTER_ID_NULL;
  let aliasId = ALIAS_ID_NULL;
  let channelId = CHANNEL_ID_NULL
  let gameSystem: string;

  gameSystem = $room.gameSystem

  $: myCharacters = $characters.filter((c) => c.owner === $myUserId);
  $: myCharacterAliases = $aliases.filter((a) => a.character === characterId);


  const onChangeCharacter = (e: CustomEvent<string>) => {
    console.log("ChatManager.onChangeCharacter");
    characterId = e.detail;
    const character = $characters.find((c) => c.id === characterId);
    aliasId = character?.activeAlias || ALIAS_ID_NULL;
  }
  const onChangeAlias = async (e: CustomEvent<string>) => {
    console.log("ChatManager.onChangeAlias", e);
    aliasId = e.detail;
    await setActiveAlias({ aliasId, characterId })
  }

  const onChangeChannel = (e: CustomEvent<string>) => {
    console.log("ChatManager.onChangeChannel", e);
    channelId = e.detail;
  }

  const onChangeGameSystem = (e: CustomEvent<string>) => {
    console.log("ChatManager.onChangeGameSystem", e);
    gameSystem = e.detail;
  }

  const onChangeShowAlias = (e: Event) => {
    console.log("ChatManager.onChangeShowAlias", e);
  };

</script>
<AliasDisplay></AliasDisplay>
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
    <DiceSelector
        gameSystem={gameSystem}
        on:changeGameSystem={e=>onChangeGameSystem(e)}
    ></DiceSelector>
    <Checkbox
        label="立絵の表示"
        checked
        onChange={(e) => onChangeShowAlias(e)}
    ></Checkbox>
    <Button>+</Button>
    <Button>-</Button>
  </div>
  <div>
    <ChatEditor
        characterId={characterId}
        aliasId={aliasId}
        channelId={channelId}
        gameSystem={gameSystem}
    ></ChatEditor>
  </div>
</fieldset>
