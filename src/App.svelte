<script lang="ts">

  import { useAuth } from "./store/auth";
  import { Auth } from "./model/Auth";
  import { authenticateWithPopUp } from "./util/googleAuthProvider";

  export let loggedIn = false;
  const { subscribe, setAuth } = useAuth();
  subscribe((a: Auth) => {
    loggedIn = (!!a.Name);
  })

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
  {loggedIn}
</main>

<style>
</style>
