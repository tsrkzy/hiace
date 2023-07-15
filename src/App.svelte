<script lang="ts">
  import { Router, Route, Link } from "svelte-routing";
  import Room from "./pages/Room.svelte";

  export let url = new URL(document.URL).pathname;
</script>

<Router {url}>
  <nav>
    <Link to="/">index</Link>
    <Link to="/r/aaaaa">/r/aaaa</Link>
  </nav>
  <Route path="/r/:id" let:params>
    <Room roomId="{params.id}"></Room>
  </Route>
  <Route path="/">index</Route>
  <Route path="*">not found</Route>
</Router>
<style>
</style>
