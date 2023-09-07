<script lang="ts">
  import { useAuth } from "../store/auth";
  import { UserCollectionService } from "../service/collection/UserCollectionService";
  import { RoomCollectionService } from "../service/collection/RoomCollectionService";
  import { authenticateWithPopUp } from "../util/googleAuthProvider";

  export let roomId = "";

  const { setAuth, authorized, name } = useAuth();
  const { fetchUserByEmail, createUser } = UserCollectionService()
  const { fetchRoomByID } = RoomCollectionService()

  $: state = "";
  $: photoUrl = "";

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

        photoUrl = user?.PhotoUrl;

        /* 部屋情報を取得 */
        const room = await fetchRoomByID(roomId);
        if (!room) {
          throw new Error(`no Room found: ${roomId}`)
        }

        /* 部屋IDへJoinしているかどうかでスイッチ振り分け */
        const { Kicked = [], Requests = [], Users = [] } = room;
        if (Kicked.indexOf(user.ID) !== -1) {
          state = "KICKED"
        } else if (Users.indexOf(user.ID) !== -1) {
          state = "JOINED"
        } else if (Requests.indexOf(user.ID) !== -1) {
          state = "WAITING"
        } else {
          state = "NO_REQUEST"
        }

      })
      .catch(e => {
        console.error(e);
      })
  }


</script>

<main>
  <h1>Auth</h1>
  <h5>roomId: {roomId}</h5>
  <button on:click={handleClick} disabled="{$authorized}">loggin</button>
  <p>authorized: {$authorized}</p>
  {#if $authorized}
    <p>name: {$name}</p>
  {/if}
  <p>roomState: {state}</p>
  <div>
    <img src="{photoUrl}" alt="gmail icon"/>
  </div>

</main>

<style>
</style>
