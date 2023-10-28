<script lang="ts">
  import { onDestroy } from "svelte";
  import { authenticateWithPopUp } from "../util/googleAuthProvider";

  /* service */
  import { UserCollectionService } from "../model/service/UserCollectionService";
  import { RoomCollectionService } from "../model/service/RoomCollectionService";

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

  /* model */
  import { Room, type RoomProps } from "../model/Room";

  /* debug components */
  import UserList from "../component/UserList.svelte";
  import CharacterList from "../component/CharacterList.svelte";

  export let roomId = "";

  /* store */
  const { setAuth, authorized, name } = useAuth();
  const { subscribeRoom } = useRoom();

  /* service */
  const { fetchUserByEmail, createUser } = UserCollectionService()
  const { setRoomStateForUser } = RoomCollectionService()

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

  $: state = "NOT_AUTHORIZED";
  $: userId = "";
  $: room = new Room({} as RoomProps);

  const subscribes: (() => unknown)[] = [];

  export const handleClick = () => {
    return authenticateWithPopUp()
      .then(async (a) => {
        /* Googleログイン後 */
        setAuth(a)

        /* ユーザ情報があれば取得し、なければ作る */
        let user = await fetchUserByEmail(a.Email)
        if (!user) {
          console.log("no user found by Email.");
          user = await createUser(a);
          console.log("user created.", user);
        }

        userId = user.Id;

        /* 部屋情報を取得 */
        // room = await fetchRoomByID(roomId);
        // if (!room.Id) {
        //   throw new Error(`no Room found: ${roomId}`)
        // }

        setRoomListener(roomId)
      })
      .catch(e => {
        console.error(e);
      })
  }

  subscribes.push(subscribeRoom(_room => {
    /* 部屋IDへJoinしているかどうかでスイッチ振り分け */
    room = _room
    const { Kicked = [], Requests = [], Users = [] } = room;
    if (Kicked.indexOf(userId) !== -1) {
      state = "KICKED"
    } else if (Users.indexOf(userId) !== -1) {
      state = "JOINED"
      startListening()
    } else if (Requests.indexOf(userId) !== -1) {
      state = "WAITING"
    } else {
      state = "NO_REQUEST"
    }
  }))

  function startListening() {
    // setRoomListener(roomId)
    setUserListener(roomId)
    setCharacterListener(roomId)
    setAliasListener(roomId)
    setMapChipListener(roomId)
    setBoardListener(roomId)
    setPawnListener(roomId)
    setChannelListener(roomId)
    setChatListener(roomId)
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
  <h1>Auth</h1>
  <h5>userId: {userId}</h5>
  <button on:click={handleClick} disabled="{$authorized}">loggin</button>
  <p>authorized: {$authorized}</p>
  <button on:click={setState("KICKED")}>KICKED</button>
  <button on:click={setState("JOINED")}>JOINED</button>
  <button on:click={setState("WAITING")}>WAITING</button>
  <button on:click={setState("NO_REQUEST")}>NO_REQUEST</button>
  {#if $authorized}
    <p>name: {$name}</p>
  {/if}
  <h1>Room</h1>
  <p>roomId: {roomId}</p>
  <p>roomState: {state}</p>
  <h2>Users</h2>
  <UserList></UserList>
  <h2>Character</h2>
  <CharacterList></CharacterList>
  <h2>Alias</h2>
  <h2>Board</h2>
  <h2>Map</h2>
  <h2>Pawn</h2>

</main>

<style>
</style>
