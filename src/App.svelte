<script lang="ts">

  import { auth } from "./store/auth";

  export let loggedIn = false;
  auth.subscribe((a) => {
    const { auth } = a;
    loggedIn = (!!auth.name);
  })
</script>

<main>
  <h1>Auth</h1>
  {loggedIn}
</main>

<style>
</style>
