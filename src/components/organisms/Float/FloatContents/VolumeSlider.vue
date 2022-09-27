<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <label>
    <span>ボリューム</span>
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value="0.1"
      @change="onInputVolume"
    />
  </label>
</template>
<script>
import { Sound } from "@/scripts/Sound";

export default {
  name: "volume-slider",
  methods: {
    onInputVolume(e) {
      const v = e.currentTarget.value;
      Sound.Volume = parseFloat(v);
    },
  },
};
</script>
