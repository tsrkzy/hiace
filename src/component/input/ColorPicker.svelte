<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  export let label: string;
  export let value: string;
  export let onChange: (e: Event) => void|Promise<void>;
</script>

<label>
  <input type="color" value={value}
         on:blur={(e)=>onChange(e)}>
  <span>{label}</span>
</label>