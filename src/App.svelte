<script lang="ts">
  import { Router, Route, Link } from "svelte-routing";
  import Room from "./page/Room.svelte";
  import CreateRoom from "./page/CreateRoom.svelte";

  export let url = new URL(document.URL).pathname;
</script>

<Router {url}>
  <nav>
    <Link to="/">index</Link>
    <Link to="/r/Pu08wfIJOH29cq3L7hMO">/r/Pu08wfIJOH29cq3L7hMO</Link>
  </nav>
  <Route path="/r/:id" let:params>
    <Room roomId="{params.id}"></Room>
  </Route>
  <Route path="/">
    <CreateRoom></CreateRoom>
  </Route>
  <Route path="*">not found</Route>
</Router>
<style>
</style>
