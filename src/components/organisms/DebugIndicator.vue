<template>
  <div class="debug-indicator" @contextmenu="onContextmenu">
    <ha-button @click="onClickSmoke">smoke</ha-button>
    <ha-button @click="onClickContext">context</ha-button>
    <ha-button @click="onAddChats">add 500 chats</ha-button>
  </div>
</template>

<script>
import { FSChat } from "@/collections/Chat";
import HaButton from "@/components/atoms/HaButton";
import { Smoke } from "@/scripts/Smoke";

export default {
  name: "DebugIndicator",
  components: {
    HaButton
  },
  methods: {
    async onClickSmoke() {
      await Smoke.on();
      const cancelId = window.setTimeout(async () => {
        await Smoke.off();
        window.clearTimeout(cancelId);
      }, 2000);
    },
    async onClickContext() {
      this.$store.dispatch("contextmenu/on");
    },
    async onContextmenu() {
      this.$store.dispatch("contextmenu/on");
    },
    async onAddChats() {
      await FSChat.AddBulk(this.room.id);
    }
  }
};
</script>

<style lang="scss" scoped>
div.debug-indicator {
  width: 40vw;
  height: 20vh;
  overflow-y: scroll;
  background-color: lightgray;
  opacity: 0.7;
}
</style>
