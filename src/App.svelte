<script lang="ts">
  import { Router, Route, } from "svelte-routing";
  import Room from "@/page/Room.svelte";
  import CreateRoom from "@/page/CreateRoom.svelte";

  export let url = new URL(document.URL).pathname;
</script>

<Router {url}>
  <Route path="/r/:id" let:params>
    <Room roomId="{params.id}"></Room>
  </Route>
  <Route path="/">
    <CreateRoom></CreateRoom>
  </Route>
  <Route path="*">not found</Route>
</Router>
