<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { Float } from "../../model/Float";
  import Button from "../button/Button.svelte";
  import { User } from "../../model/User";
  import { useRoom } from "../../model/store/room";
  import { useUsers } from "../../model/store/users";

  const { myUserId } = useUsers();
  const { room } = useRoom();

  export let float = {} as Float

  $: isOwner = $room.owner === $myUserId;
  let requestUsers: User[] = []
  let userItems: User[] = []

  const onClickGrant = (userId: string) => {
    console.log("RoomManager.onClickGrant");
    console.log(userId);
  };
  const makeRequest = () => {
  };
  const onClickDrop = (userId: string) => {
    console.log("RoomManager.onClickDrop");
    console.log(userId);
  };
  const onClickKick = (userId: string) => {
    console.log("RoomManager.onClickKick");
    console.log(userId);
  };
</script>

<fieldset>
  <legend>個人設定</legend>
  <input type="color">
  <h5>個別のチャンネル(全体以外)への発言</h5>
  <label>
    <input type="checkbox"/>
    <span>発言内容を伏せる</span>
  </label>
  <h5>タブが非アクティブの時に通知音を鳴らす</h5>
  <label>
    <input type="checkbox"/>
    <span>新着チャットを通知する</span>
  </label>
</fieldset>
{#if isOwner}
  <div>
    {#each requestUsers as r}
      <fieldset>
        {r}
        <legend>入室リクエスト:{r.id},{ r.email }</legend>
        <Button handle={()=>onClickGrant(r.id)}>許可</Button>
        <Button handle={()=>onClickKick(r.id)}>キック</Button>
      </fieldset>
    {/each}
  </div>
{:else }
  <fieldset>
    <legend>入室状況</legend>
    <div>
      <span>キックされました</span>
    </div>
    <div>
      <span>入出許可待ち</span>
    </div>
    <div>
      <Button on:click={()=>makeRequest()}>入室リクエストを送る</Button>
    </div>
    <div>
      <span>入室済み</span>
    </div>
  </fieldset>
{/if}
<fieldset>
  <legend>参加中のユーザ</legend>
  <ul>
    {#each userItems as u}
      <li>
          <span
          > isOwner(u.id) ? "[admin] " : ""  / u.email /  isMe(u.id) ? "(自分)" : "" </span
          >
        <Button
            on:click={()=>onClickDrop(u.id)}
        >退室させる
        </Button>
        <Button
            on:click={()=>onClickKick(u.id)}
        >キック
        </Button>
      </li>
    {/each}
  </ul>
  <label>
    <input type="checkbox">
    <span>追放操作を有効にする</span>
  </label>
</fieldset>
<fieldset>
  <legend>DL</legend>
  <Button>チャットをダウンロードする</Button>
  <Button>チャットをすべて削除する</Button>
</fieldset>
<fieldset>
  <legend>外部サイト</legend>
  <p>
    <a
        target="_blank"
        href="https://on-jin.com/sound/index.php?kensaku=%E3%83%80%E3%82%A4%E3%82%B9"
    >on-jin.com</a
    ><span>(フリー効果音、BGM)</span>
  </p>
  <p>
    <a href="https://github.com/tsrkzy/hiace/wiki" target="_blank"
    >使い方(Wiki/Github)</a
    >
  </p>
</fieldset>