<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <button
    v-if="duplicatable"
    @mousedown.stop
    @click="onClickDuplicate($event)"
    style="float: right"
  >
    ＋
  </button>
</template>
<script>
import { FLOAT_SINGLETON_LIST } from "@/interfaces/IFFloat";

export default {
  name: "float-duplicator",
  props: {
    floatId: { type: Number, require: true },
  },
  methods: {
    async onClickDuplicate(e) {
      e.stopPropagation();
      const contentId = this.contentId;
      if (!contentId) {
        return false;
      }
      await this.$store.dispatch("float/create", { contentId, show: true });
    },
  },
  computed: {
    contentId() {
      const { contentId = null } =
        this.$store.getters["float/info"].find((f) => f.id === this.floatId) ??
        {};
      return contentId;
    },
    duplicatable() {
      return FLOAT_SINGLETON_LIST.indexOf(this.contentId) === -1;
    },
  },
};
</script>
