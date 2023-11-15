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

  export let float = {} as Float;

  const onChangeShowAlias = (e: Event) => {
    console.log("ChatManager.onChangeShowAlias", e);
  };
</script>


<ChatLogViewer floatId={float.id}></ChatLogViewer>
<fieldset>
  <legend>チャット設定</legend>
  <div style="white-space: nowrap">
    <select>
      <option>キャラクタ</option>
    </select><select>
    <option>立絵</option>
  </select>
    <select>
      <option>チャンネル</option>
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