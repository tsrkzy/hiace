<!-----------------------------------------------------------------------------
  - Copyright (c) 2023.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<script lang="ts">
  export let label: string ="";
  export let min: number;
  export let max: number;
  export let step: number;
  export let value: number;
  export let onChange: (e: Event) => void;
</script>

<label>
  <span>{label}</span>
  <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      on:change={(e)=>onChange(e)}
  >
</label>
