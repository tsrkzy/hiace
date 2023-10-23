<script lang="ts">
  import { onDestroy } from "svelte";
  import { useAuth } from "../store/auth";
  import { UserCollectionService } from "../service/collection/UserCollectionService";
  import { RoomCollectionService } from "../service/collection/RoomCollectionService";
  import { authenticateWithPopUp } from "../util/googleAuthProvider";
  import { RoomListener } from "../model/listener/RoomListener";
  import { useRoom } from "../store/room";

  export let roomId = "";

  const { setAuth, authorized, name } = useAuth();
  const { subscribe } = useRoom();
  const { fetchUserByEmail, createUser } = UserCollectionService()
  const { fetchRoomByID, setRoomStateForUser } = RoomCollectionService()
  const { setRoomListener } = RoomListener();

  $: state = "NOT_AUTHORIZED";
  $: userId = "";

  const subscribes = [];

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

        userId = user.ID;

        /* 部屋情報を取得 */
        const room = await fetchRoomByID(roomId);
        if (!room) {
          throw new Error(`no Room found: ${roomId}`)
        }

        setRoomListener(roomId)
      })
      .catch(e => {
        console.error(e);
      })
  }

  subscribes.push(subscribe(room => {
    /* 部屋IDへJoinしているかどうかでスイッチ振り分け */
    const { Kicked = [], Requests = [], Users = [] } = room;
    if (Kicked.indexOf(userId) !== -1) {
      state = "KICKED"
    } else if (Users.indexOf(userId) !== -1) {
      state = "JOINED"
    } else if (Requests.indexOf(userId) !== -1) {
      state = "WAITING"
    } else {
      state = "NO_REQUEST"
    }
  }))

  export const setState = (state) => {
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
  <h5>roomId: {roomId}</h5>
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
  <p>roomState: {state}</p>

</main>

<style>
</style>
