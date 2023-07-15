<script lang="ts">

  import { useAuth } from "./store/auth";
  import { authenticateWithPopUp } from "./util/googleAuthProvider";

  const { setAuth, authorized } = useAuth();

  export const handleClick = () => {
    return authenticateWithPopUp()
      .then((a) => {
        setAuth(a)
      })
      .catch(e => {
        console.error(e);
      })

  }
</script>

<main>
  <h1>Auth</h1>
  <button on:click={handleClick}>loggin</button>
  {$authorized}
</main>

<style>
</style>
