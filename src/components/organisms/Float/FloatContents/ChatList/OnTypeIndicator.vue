<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <p v-if="text">{{ text }}</p>
</template>
<script>
export default {
  name: "on-type-indicator",
  props: {
    debug: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.intervalId = window.setInterval(this.updateText, 1000);
  },
  beforeDestroy() {
    if (typeof this.intervalId === "number") {
      window.clearInterval(this.intervalId);
    }
  },
  computed: {
    me() {
      return this.$store.getters["auth/user"];
    }
  },
  methods: {
    updateText() {
      const onTypeList = [];
      const SPAN_MS = 2000;
      const now = Date.now();
      const users = this.$store.getters["user/info"];
      for (let i = 0; i < users.length; i++) {
        const u = users[i];
        if (u.id === this.me.id) {
          continue;
        }
        const { lastPing = 0 } = u;
        if (now - lastPing < SPAN_MS) {
          onTypeList.push(u);
        }
      }

      this.text = onTypeList.map(u => u.name).join(", ");
    }
  },
  data() {
    return {
      intervalId: null,
      text: " "
    };
  }
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
  color: dimgray;
}
</style>
