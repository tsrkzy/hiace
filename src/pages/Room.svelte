<script lang="ts">
  import { useAuth } from "../store/auth";
  import { FSUser } from "../collection/user";
  import { authenticateWithPopUp } from "../util/googleAuthProvider";

  export let roomId = "";

  const { setAuth, authorized, name } = useAuth();
  const { fetchUserByEmail } = FSUser()


  export const handleClick = () => {
    return authenticateWithPopUp()
      .then(async (a) => {
        setAuth(a)
        const user = await fetchUserByEmail(a.Email)
        console.log(user);
      })
      .catch(e => {
        console.error(e);
      })

  }
</script>

<main>
  <h1>Auth</h1>
  <h5>{roomId}</h5>
  <button on:click={handleClick}>loggin</button>
  <p>authorized: {$authorized}</p>
  {#if $authorized}
    <p>name: {$name}</p>
  {/if}

</main>

<style>
</style>
