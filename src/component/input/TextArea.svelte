<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  export let placeholder: string;
  export let value: string;
  export let onBlur: (e: FocusEvent) => void|Promise<void>;
</script>


<textarea
    placeholder={placeholder}
    value={value}
    on:blur={(e)=>onBlur(e)}
></textarea>