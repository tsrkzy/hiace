<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  export let label: string;
  export let value: string;
  export let onBlur: (e: FocusEvent) => void|Promise<void>;
</script>
<label>
  <span>{label}</span>
  <input type="text" value={value}
         on:blur={(e)=>onBlur(e)}>
</label>