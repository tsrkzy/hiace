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
  import { createUserChat } from "@/model/service/ChatService";
  import { useRoom } from "@/model/store/room";

  export let float = {} as Float;


  let characterId = CHARACTER_ID_NULL;
  let aliasId = ALIAS_ID_NULL;
  let channelId = CHANNEL_ID_NULL
  let chatText = "";
  let historyKey = -1;

  const { myUserId } = useUsers();
  const { characters } = useCharacters();
  const { aliases } = useAliases();
  const { channels } = useChannels();
  const { room } = useRoom();

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

  const onKeyDownTextarea = async (e: KeyboardEvent) => {
    console.log("ChatManager.onKeyDownTextarea", e);
    const { code, isComposing, shiftKey } = e;
    const currentTarget = e.currentTarget as HTMLTextAreaElement;
    const { value: value = "", selectionStart } = currentTarget;

    chatText = value;

    const historyList: { key: number, text: string }[] = [];
    const historyLength = historyList.length;

    const firstLineLength = value.split("\n")[0].length;
    const caretOnFirstLine = selectionStart <= firstLineLength;

    const lowerCode = code.toLowerCase();
    if (
      !isComposing &&
      !shiftKey &&
      lowerCode === "arrowup" &&
      caretOnFirstLine &&
      historyLength !== 0
    ) {
      /* 変換中でなく、キャレットが文頭にある時にarrowupが入力された場合 */
      historyKey++;
      historyKey =
        historyKey >= historyLength ? 0 : historyKey;
      const history = historyList.find((h) => h.key === historyKey);
      if (history) {
        chatText = history.text;
        return;
      }
    }

    /* ヒストリ呼出しでない or ヒストリがない場合はヒストリ参照をリセット */
    historyKey = -1;

    if (!isComposing && !shiftKey && lowerCode === "enter") {
      /* 変換中でない場合のEnter */
      e.preventDefault();
      await sendChat();
    }

    /* 〜が入力中 */
    sendChatter();
  }

  const sendChat = () => {
    console.log("ChatManager.sendChat");
    if (!channelId) {
      throw new Error("no channel found");
    }

    const text = chatText.trim();
    const _chatText = chatText;
    chatText = "";
    try {
      console.log(channelId);
      createUserChat({
        roomId: $room.id,
        channelId,
        userId: $myUserId,
        characterId: characterId,
        aliasId: aliasId,
        text,
      })
    } catch (e) {
      chatText = _chatText;
      console.error(e);
    }
  }

  const sendChatter = () => {
    console.log("ChatManager.sendChatter");
    // Socket.Send(ON_TYPE, { userName: userName, characterId: characterId });
  }
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
        value={chatText}
        on:keydown={onKeyDownTextarea}
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