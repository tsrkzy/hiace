<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  export let handle = () => {
  }
  export let disabled = false
</script>

<button {disabled} on:click|stopPropagation={()=>handle()}>
  <slot></slot>
</button>