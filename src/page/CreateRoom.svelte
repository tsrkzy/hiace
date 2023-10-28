<script lang="ts">
  import { navigate } from "svelte-routing";
  import { authenticateWithPopUp } from "../util/googleAuthProvider";
  import { fetchUserByEmail, createUser, joinRoom } from "../model/service/UserService";
  import { createRoom } from "../model/service/RoomService";
  import { useAuth } from "../model/store/auth";
  const { isLoggedIn, setAuth } = useAuth();


  const GAME_SYSTEM_LIST = [{ system: "Cthulhu", name: "クトゥルフ神話TRPG" },
    { system: "Cthulhu7th", name: "新クトゥルフ神話TRPG" },
    { system: "Kamigakari", name: "神我狩" },
    { system: "SwordWorld", name: "ソードワールドRPG" },
    { system: "SwordWorld2.0", name: "ソードワールド2.0" },
    { system: "SwordWorld2.5", name: "ソードワールド2.5" },]


  let userId = "";
  $: roomName = "";
  $: gameSystem = "null";
  $: disableCreateRoom = !roomName || gameSystem === "null";

  export const handleLogIn = () => {
    return authenticateWithPopUp()
      .then(async (a) => {
        /* Googleログイン後 */
        setAuth(a)

        /* ユーザ情報があれば取得し、なければ作る */
        const user = await fetchUserByEmail(a.email)
        if (!user) {
          console.log("no user found by Email.");
          const u = await createUser(a);
          console.log("user created.", u);
          userId = u.id
        } else {
          userId = user.id;
        }
      })
      .catch(e => {
        console.error(e);
      })

  }

  export const handleClick = async () => {
    console.log("CreateRoom.handleClick");
    if (!isLoggedIn) {
      throw new Error("not authorized");
    }

    /* 部屋の作成 */
    const room =
      await createRoom({
        Name: roomName,
        Owner: userId,
        GameSystem: gameSystem,
      })

    /* WebSocket */
    // new Socket(room.Id);

    /* roomに参加 */
    // RoomCollectionService.joinRoom(userId, room.id)
    await joinRoom(userId, room.id);

    /* /r/:roomId へ仮想ルーティング */
    navigate(`/r/${room.id}`, { replace: true });

  }

  export const handleRoomNameInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement; }) => {
    console.log("CreateRoom.handleRoomNameInput", e);
    const { currentTarget: { value = "" } } = e;
    roomName = value.trim();
  }

  export const handleGameSystemChange = (e: Event & { currentTarget: EventTarget & HTMLSelectElement; }) => {
    console.log("CreateRoom.handleGameSystemChange", e);
    gameSystem = e.currentTarget.value;
  }
</script>

<main>
  <div class="container">
    $authorized: {$isLoggedIn}
    <fieldset class="create-room__fieldset">
      <legend>部屋の作成</legend>
      {#if !$isLoggedIn}
        <div>
          <p>Googleアカウントでのログインが必要です</p>
          <button on:click={handleLogIn}>loggin</button>
        </div>
      {:else }
        <div>
          <label>
            <span>部屋名</span>
            <input
                type="text"
                value=""
                placeholder="必須"
                on:input={handleRoomNameInput}
            >
          </label>
          <select on:input={handleGameSystemChange}>
            <option value="null" selected disabled>ダイスシステム(必須)</option>
            {#each GAME_SYSTEM_LIST as { system, name }}}
              <option value="{system}">{name}</option>
            {/each}
          </select>
          <button
              disabled="{disableCreateRoom}"
              on:click={handleClick}
          >作成
          </button>
          <p>roomName: {roomName}</p>
          <p>gameSystem: {gameSystem}</p>
        </div>
      {/if}
    </fieldset>
  </div>

</main>

<style>
</style>
