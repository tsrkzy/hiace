<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <button v-if="content" class="help" disabled style="float: right">
    ？
    <pre class="tooltip">{{ content }}</pre>
  </button>
</template>
<script>
import { getHelpMessage } from "@/scripts/helper";

export default {
  name: "hint-container",
  props: {
    floatId: { type: Number, require: true },
  },
  computed: {
    content() {
      return getHelpMessage(this.floatId);
    },
  },
};
</script>
<style lang="scss" scoped>
button.help {
  position: relative;

  .tooltip {
    visibility: hidden;
    position: absolute;
    right: -50px;
    width: 400px;
    word-break: break-word;
    white-space: pre-line;
    text-align: left;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: rgba(0, 0, 0, 0.7);
    color: aliceblue;
  }

  &:hover {
    .tooltip {
      visibility: visible;
    }
  }
}
</style>
