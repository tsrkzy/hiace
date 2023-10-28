<script lang="ts">
  import { onDestroy } from "svelte";
  import { authenticateWithPopUp } from "../util/googleAuthProvider";
  import { UserCollectionService } from "../model/service/UserCollectionService";
  import { RoomCollectionService } from "../model/service/RoomCollectionService";
  import { useAuth } from "../model/store/auth";
  import { useRoom } from "../model/store/room";
  import { useUsers } from "../model/store/users";
  import { RoomListener } from "../model/listener/RoomListener";
  import { UserListener } from "../model/listener/UserListener";
  import { User } from "../model/User";

  export let roomId = "";

  const { setAuth, authorized, name } = useAuth();
  const { subscribeRoom } = useRoom();
  const { subscribeUsers } = useUsers()
  const { fetchUserByEmail, createUser } = UserCollectionService()
  const { fetchRoomByID, setRoomStateForUser } = RoomCollectionService()
  const { setRoomListener } = RoomListener();
  const { setUserListener } = UserListener();

  $: state = "NOT_AUTHORIZED";
  $: userId = "";
  $: users = [] as User[];

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

  subscribes.push(subscribeRoom(room => {
    /* 部屋IDへJoinしているかどうかでスイッチ振り分け */
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
  subscribes.push(subscribeUsers((_users: User[]) => {
    users = _users
  }))

  function startListening() {
    setUserListener(roomId)
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
  {#each users as user}
    <ul>
      <li>{user.Id},{user.Name}</li>
    </ul>
  {/each}
  <h1>Character</h1>
  <h2>Alias</h2>
  <h1>Board</h1>
  <h2>Map</h2>
  <h2>Pawn</h2>

</main>

<style>
</style>
