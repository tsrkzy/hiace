<template>
  <div class="debug-indicator" @contextmenu="onContextmenu">
    <p>music: {{ music }}</p>
    <p>playing: {{ playing }}</p>
    <ha-button @click="onClickSmoke">smoke</ha-button>
    <ha-button @click="onClickContext">context</ha-button>
    <ha-button @click="onAddChats">add 500 chats</ha-button>
    <ha-button @click="onAddDice">ADD DICE</ha-button>
    <ha-button @click="onResetWindow">RESET WINDOW</ha-button>
    <pre>{{ dices }}</pre>
  </div>
</template>

<script>
import { FSChat } from "@/collections/Chat";
import { FSDice } from "@/collections/Dice";
import HaButton from "@/components/atoms/HaButton";
import { Smoke } from "@/scripts/Smoke";

export default {
  name: "DebugIndicator",
  components: {
    HaButton,
  },
  computed: {
    room() {
      return this.$store.getters["room/info"];
    },
    dices() {
      return this.$store.getters["dice/info"];
    },
    music() {
      return this.$store.getters["room/music"];
    },
    playing() {
      return this.$store.getters["sound/playing"];
    },
  },
  methods: {
    async onAddDice() {
      const boardId = this.$store.getters["room/activeBoard"];
      const roomId = this.$store.getters["room/info"].id;
      const userId = this.$store.getters["auth/user"].id;
      await FSDice.Create({
        boardId,
        roomId,
        userId,
      });
    },
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
    },
    async onResetWindow() {
      console.log("DebugIndicator.onResetWindow");
      window.localStorage.removeItem("config");
    },
  },
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
