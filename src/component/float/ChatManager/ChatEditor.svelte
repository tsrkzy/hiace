<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<script lang="ts">

  import { sendChat } from "@/model/service/ChatService";
  import { useRoom } from "@/model/store/room";
  import { useUsers } from "@/model/store/users";
  import { SocketMessageType, Socket } from "@/socket/Socket";

  export let channelId: string;
  export let characterId: string;
  export let aliasId: string;
  export let gameSystem: string;

  let chatText = "";
  let historyKey = -1;

  const { room } = useRoom();
  const { myUserId, myName } = useUsers();


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
      await chatHandler();
    }

    /* 〜が入力中 */
    sendChatter();
  }

  const chatHandler = async () => {
    console.log("ChatManager.chatHandler");
    if (!channelId) {
      throw new Error("no channel found");
    }

    const text = chatText.trim();
    const _chatText = chatText;
    chatText = "";
    try {
      await sendChat({
        roomId: $room.id,
        channelId,
        userId: $myUserId,
        characterId: characterId,
        aliasId: aliasId,
        text,
      }, gameSystem)
    } catch (e) {
      chatText = _chatText;
      console.error(e);
    }
  }

  const sendChatter = () => {
    console.log("ChatManager.sendChatter");
    Socket.Send(SocketMessageType.ON_TYPE, { userName: $myName, characterId });
  }

</script>

<textarea
    value={chatText}
    on:keydown={onKeyDownTextarea}
    class="chat-list__textarea-wrapper"
    rows="2"
    placeholder="enter: send / shift+enter: new line / arrow up: dice log"
></textarea>

<style>
    textarea.chat-list__textarea-wrapper {
        width: 100%;
        height: 100%;
        resize: none;
    }
</style>