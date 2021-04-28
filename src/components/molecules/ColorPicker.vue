<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <label>
    <span>{{ label || "文字色" }}</span>
    <input type="color" :value="chatColor" @change="onChangeColor($event)" />
  </label>
</template>
<script>
export default {
  name: "color-picker",
  props: {
    label: { type: String, default: "" },
    chatColor: { type: String, require: true }
  },
  methods: {
    onChangeColor(e) {
      const color = e.currentTarget.value;
      this.$emit("change", color);
    }
  }
};
</script>
