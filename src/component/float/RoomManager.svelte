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
  import { assignUserToRoom, fetchUsersById, } from "../../model/service/UserService";
  import { useUsers } from "../../model/store/users";
  import { joinRoom } from "../../model/service/RoomService";
  import { useLocalConfig } from "../../model/store/localConfig";

  const { myUserId, users } = useUsers();
  const { room } = useRoom();
  const { localConfig } = useLocalConfig();

  export const float = {} as Float

  $: isOwner = $room.owner === $myUserId;

  let isBanMode = false

  let requestUsers: User[] = []
  $: {
    fetchUsersById($room.requests).then(users => {
      requestUsers = users
    })
  }


  const onClickGrant = async (userId: string) => {
    console.log("RoomManager.onClickGrant");
    await joinRoom(userId, $room.id)
    await assignUserToRoom(userId, $room.id)
  };
  const onClickDrop = (userId: string) => {
    console.log("RoomManager.onClickDrop");
    console.log(userId);
  };
  const onClickKick = (userId: string) => {
    console.log("RoomManager.onClickKick");
    console.log(userId);
  };

  const onChangeMaskChannel = (e: Event) => {
    console.log("RoomManager.onChangeMaskChannel");
    const { checked } = e.currentTarget as HTMLInputElement;
    $localConfig.maskChannel = checked;
  }

  const onChangeRing = (e: Event) => {
    console.log("RoomManager.onChangeRing");
    const { checked } = e.currentTarget as HTMLInputElement
    $localConfig.ring = checked;
  }

</script>

<fieldset>
  <legend>個人設定</legend>
  <input type="color">
  <h5>個別のチャンネル(全体以外)への発言</h5>
  <label>
    <input type="checkbox" checked={$localConfig.maskChannel} on:change={onChangeMaskChannel}/>
    <span>発言内容を伏せる</span>
  </label>
  <h5>タブが非アクティブの時に通知音を鳴らす</h5>
  <label>
    <input type="checkbox" checked={$localConfig.ring} on:change={onChangeRing}/>
    <span>新着チャットを通知する</span>
  </label>
</fieldset>
{#if isOwner}
  <div>
    {#each requestUsers as r}
      <fieldset>
        <legend>入室リクエスト:{ r.email }</legend>
        <Button handle={()=>onClickGrant(r.id)}>許可</Button>
        <Button handle={()=>onClickKick(r.id)}>キック</Button>
      </fieldset>
    {/each}
  </div>
{/if}
<fieldset>
  <legend>参加中のユーザ</legend>
  <ul>
    {#each $users as u}
      <li>
          <span
          > {$room.owner === u.id ? "[admin] " : ""}{ u.email } {u.id === $myUserId ? "(自分)" : ""} </span
          >
        {#if isOwner && u.id === $myUserId && isBanMode}
          <Button
              on:click={()=>onClickDrop(u.id)}
          >退室させる
          </Button>
          <Button
              on:click={()=>onClickKick(u.id)}
          >キック
          </Button>
        {/if}
      </li>
    {/each}
  </ul>
  <label>
    <input type="checkbox" bind:value={isBanMode}>
    <span>追放操作を有効にする</span>
  </label>
</fieldset>
<fieldset>
  <legend>DL</legend>
  <Button>チャットをダウンロードする</Button>
  <!--  <Button>チャットをすべて削除する</Button>-->
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