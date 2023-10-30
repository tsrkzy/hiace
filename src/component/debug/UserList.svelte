<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { useUsers } from "../../model/store/users";

  export let open = false;

  const { users } = useUsers();

</script>

<main>
  <details {open}>
    <summary>Users</summary>
    {#each $users as u}
      <ul>
        <li>{u.id},{u.name}</li>
      </ul>
    {/each}
  </details>
</main>