<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  import { onDestroy } from "svelte";
  import { User } from "../model/User";
  import { useUsers } from "../model/store/users";
  const { subscribeUsers } = useUsers()

  $: users = [] as User[];
  const subscribes: (() => unknown)[] = [];
  subscribes.push(subscribeUsers((_users: User[]) => {
    users = _users
  }))
  onDestroy(() => {
    subscribes.forEach(s => s());
  })
</script>

<main>
  {#each users as u}
    <ul>
      <li>{u.Id},{u.Name}</li>
    </ul>
  {/each}
</main>