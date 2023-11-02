<script lang="ts">
  import { get } from "svelte/store";

  /* service */
  import { fetchUserByEmail, } from "../model/service/UserService";
  import { setRoomStateForUser } from "../model/service/RoomService";

  /* store */
  import { useAuth } from "../model/store/auth";
  import { useRoom } from "../model/store/room";
  import { useUsers } from "../model/store/users";
  import "../model/store/localConfig"

  /* listener */
  import { RoomListener } from "../model/listener/RoomListener";
  import { UserListener } from "../model/listener/UserListener";
  import { CharacterListener } from "../model/listener/CharacterListener";
  import { AliasListener } from "../model/listener/AliasListener";
  import { MapChipListener } from "../model/listener/MapChipListener";
  import { BoardListener } from "../model/listener/BoardListener";
  import { PawnListener } from "../model/listener/PawnListener";
  import { ChannelListener } from "../model/listener/ChannelListener";
  import { ChatListener } from "../model/listener/ChatListener";
  import { ColumnListener } from "../model/listener/ColumnListener";
  import { DiceListener } from "../model/listener/DiceListener";
  import { ImageSourceListener } from "../model/listener/ImageSourceListener";
  import { SoundListener } from "../model/listener/SoundListener";
  import { TableListener } from "../model/listener/TableListener";

  /* debug components */
  import UserList from "../component/debug/UserList.svelte";
  import CharacterList from "../component/debug/CharacterList.svelte";
  import BoardList from "../component/debug/BoardList.svelte";
  import ChannelList from "../component/debug/ChannelList.svelte";

  /* components */
  import GoogleLogInButton from "../component/button/GoogleLogInButton.svelte";
  import FloatGroup from "../component/float/FloatGroup.svelte";
  import NoticeGroup from "../component/NoticeGroup.svelte";
  import ImageSourceList from "../component/debug/ImageSourceList.svelte";

  export let roomId = "";

  /* store */
  const { isLoggedIn, email } = useAuth();
  const { room, userIdForRoomState, setUserIdForRoomState } = useRoom();
  const { myUserId } = useUsers();

  /* listener */
  const { setRoomListener } = RoomListener();
  const { setUserListener } = UserListener();
  const { setCharacterListener } = CharacterListener();
  const { setAliasListener } = AliasListener();
  const { setMapChipListener } = MapChipListener();
  const { setBoardListener } = BoardListener();
  const { setPawnListener } = PawnListener();
  const { setChannelListener } = ChannelListener();
  const { setChatListener } = ChatListener();
  const { setColumnListener } = ColumnListener();
  const { setDiceListener } = DiceListener();
  const { setImageSourceListener } = ImageSourceListener();
  const { setSoundListener } = SoundListener();
  const { setTableListener } = TableListener();

  $: state = "NOT_AUTHORIZED";
  $: isJoined = state === "JOINED"
  $: isKicked = state === "KICKED"
  $: isWaiting = state === "WAITING"
  $: noRequest = state === "NO_REQUEST"

  /* 描画時にログイン済みの場合 */
  if (get(isLoggedIn) && get(email)) {
    fetchUserByEmail(get(email)).then(user => {
      if (!user) {
        throw new Error("auth information corrupted.")
      }

      setUserIdForRoomState(user.id);
      setRoomListener(roomId)
    }).catch((e) => {
      console.error(e);
      throw e
    })
  }

  $: {
    /* 部屋IDへJoinしているかどうかでスイッチ振り分け */
    const { kicked = [], requests = [], users = [] } = $room;
    if (kicked.indexOf(get(userIdForRoomState)) !== -1) {
      state = "KICKED"
    } else if (users.indexOf(get(userIdForRoomState)) !== -1) {
      state = "JOINED"
      startListening()
    } else if (requests.indexOf(get(userIdForRoomState)) !== -1) {
      state = "WAITING"
    } else {
      state = "NO_REQUEST"
    }
  }


  function startListening() {
    setUserListener(roomId)
    setCharacterListener(roomId)
    setAliasListener(roomId)
    setMapChipListener(roomId)
    setBoardListener(roomId)
    setPawnListener(roomId)
    setChannelListener(roomId)
    setChatListener(roomId)
    setColumnListener(roomId)
    setDiceListener(roomId)
    setImageSourceListener(roomId)
    setSoundListener(roomId)
    setTableListener(roomId)
  }

  export const setState = (state: string) => {
    return async () => {
      await setRoomStateForUser({
        RoomId: roomId,
        UserId: get(userIdForRoomState),
        State: state
      })
    }
  }

</script>

<main>
  <div id="floor" class="floor_container">
    <div style="position: fixed; top: 0; left: 0">
    </div>

    {#if !$isLoggedIn}
      <!-- Google認証がまだならGoogle認証ボタンのみ表示 -->
      <GoogleLogInButton cb={()=>setRoomListener(roomId)}></GoogleLogInButton>
    {:else if noRequest}
      <button on:click={setState("WAITING")}>入室リクエスト</button>
    {:else if isKicked}
      <p>キックされました</p>
    {:else if isJoined}
      <p>ゲーム画面</p>
      <!-- <SvgBoard></SvgBoard> -->
      <!-- <ContextMenu></ContextMenu> -->
      <FloatGroup></FloatGroup>

    {:else if isWaiting}
      <p>リクエスト承認待ち</p>
    {/if}
  </div>
  <div style="position:absolute;top:0;right:0;width:50vw;">
    <details>
      <summary>Auth</summary>
      <h5>userIdForRoomState: {$userIdForRoomState}</h5>
      <GoogleLogInButton cb={()=>setRoomListener(roomId)}></GoogleLogInButton>
      <p>isLoggedIn: {$isLoggedIn}</p>
      <button on:click={setState("KICKED")}>KICKED</button>
      <button on:click={setState("JOINED")}>JOINED</button>
      <button on:click={setState("WAITING")}>WAITING</button>
      <button on:click={setState("NO_REQUEST")}>NO_REQUEST</button>
      {#if $isLoggedIn}
        <p>email: {$email}</p>
      {/if}
    </details>
    <details>
      <summary>Me</summary>
      me.id: {$myUserId}
    </details>
    <details>
      <summary>Room</summary>
      <p>roomId: {roomId}</p>
      <p>roomState: {state}</p>
      <p>requests: {$room.requests}</p>
      <p>users: {$room.users}</p>
    </details>
    <UserList></UserList>
    <CharacterList></CharacterList>
    <BoardList></BoardList>
    <ChannelList ></ChannelList>
    <ImageSourceList open></ImageSourceList>

  </div>
  <NoticeGroup></NoticeGroup>
</main>

<style>
</style>
