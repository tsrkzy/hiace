<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  export let label: string;
  export let checked: boolean;
  export let onChange: (e: Event) => void;
  export let disabled = false;
</script>
<label>
  <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      on:change={(e)=>onChange(e)}>
  <span>{label}</span>
</label>