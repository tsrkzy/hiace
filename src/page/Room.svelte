<script lang="ts">
  import { onDestroy } from "svelte";
  import { get } from "svelte/store";
  import { authenticateWithPopUp } from "../util/googleAuthProvider";

  /* service */
  import { fetchUserByEmail, createUser } from "../model/service/UserService";
  import { setRoomStateForUser } from "../model/service/RoomService";

  /* store */
  import { useAuth } from "../model/store/auth";
  import { useRoom } from "../model/store/room";

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
  import UserList from "../component/UserList.svelte";
  import CharacterList from "../component/CharacterList.svelte";
  import { useUsers } from "../model/store/users";
  import BoardList from "../component/BoardList.svelte";
  import ChannelList from "../component/ChannelList.svelte";

  export let roomId = "";

  /* store */
  const { setAuth, isLoggedIn, email } = useAuth();
  const { room } = useRoom();
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
  $: userId = "";

  /* 描画時にログイン済みの場合 */
  if (get(isLoggedIn) && get(email)) {
    fetchUserByEmail(get(email)).then(user => {
      if (!user) {
        throw new Error("auth information corrupted.")
      }

      userId = user.id;
      setRoomListener(roomId)
    }).catch((e) => {
      console.error(e);
      throw e
    })
  }

  const subscribes: (() => unknown)[] = [];

  export const handleClick = () => {
    return authenticateWithPopUp()
      .then(async (a) => {
        /* Googleログイン後 */
        setAuth(a)

        /* ユーザ情報があれば取得し、なければ作る */
        let user = await fetchUserByEmail(a.email)
        if (!user) {
          console.log("no user found by Email.");
          user = await createUser(a);
          console.log("user created.", user);
        }

        userId = user.id;

        setRoomListener(roomId)
      })
      .catch(e => {
        console.error(e);
      })
  }

  $: {
    /* 部屋IDへJoinしているかどうかでスイッチ振り分け */
    const { kicked = [], requests = [], users = [] } = $room;
    if (kicked.indexOf(userId) !== -1) {
      state = "KICKED"
    } else if (users.indexOf(userId) !== -1) {
      state = "JOINED"
      startListening()
    } else if (requests.indexOf(userId) !== -1) {
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
      await setRoomStateForUser({ RoomId: roomId, UserId: userId, State: state })
    }
  }

  onDestroy(() => {
    subscribes.forEach(s => s());
  })

</script>

<main>
  <details open>
    <summary>Auth</summary>
    <h5>userId: {userId}</h5>
    <button on:click={handleClick} disabled="{$isLoggedIn}">loggin</button>
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
  </details>
  <UserList></UserList>
  <CharacterList></CharacterList>
  <BoardList></BoardList>
  <ChannelList open></ChannelList>
</main>

<style>
</style>
