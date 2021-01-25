<template>
  <div
    style="width:40vw;height: 90vh;overflow-y: scroll;background-color: lightgray;opacity: 0.7; "
    @contextmenu="onContextmenu"
  >
    <ha-button @click="onClickSmoke">smoke</ha-button>
    <ha-button @click="onClickContext">context</ha-button>
    <ha-button @click="onAddChats">add 500 chats</ha-button>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSBoard } from "@/collections/Board";
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSChat } from "@/collections/Chat";
import { FSImage } from "@/collections/Image";
import { FSPawn } from "@/collections/Pawn";
import { FSRoom } from "@/collections/Room";
import { FSSound } from "@/collections/Sound";
import { FSTable } from "@/collections/Table";
import HaButton from "@/components/atoms/HaButton";
import { Smoke } from "@/scripts/Smoke";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";

export default {
  name: "DebugIndicator",
  components: {
    HaButton
  },
  created() {
    this.milliSecond = null;
    const clock = () => {
      console.log("tick"); // @DELETEME
      this.milliSecond = Date.now();
    };
    this.clock_id = window.setInterval(clock, 1000);
  },
  beforeDestroy() {
    clearInterval(this.clock_id);
  },
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    userName() {
      return this.$store.getters["auth/user"].name;
    },
    userIdList() {
      return this.room.users;
    },
    users() {
      return this.$store.getters["user/info"];
    },
    room() {
      return this.$store.getters["room/info"];
    },
    channels() {
      return this.$store.getters["channel/info"];
    },
    characters() {
      return this.$store.getters["character/info"];
    },
    aliases() {
      return this.$store.getters["alias/info"];
    },
    chats() {
      return this.$store.getters["chat/info"];
    },
    images() {
      return this.$store.getters["image/info"];
    },
    sounds() {
      return this.$store.getters["sound/info"];
    },
    boards() {
      return this.$store.getters["board/info"];
    },
    maps() {
      return this.$store.getters["map/info"];
    },
    pawns() {
      return this.$store.getters["pawn/info"];
    },
    tables() {
      return this.$store.getters["table/info"];
    },
    tableItems() {
      return this.$store.getters["table/matrixList"];
    },
    boardItems() {
      return this.$store.getters["board/info"].map(b => ({
        id: b.id,
        name: `b_${b.id}`
      }));
    },
    activeBoard() {
      return this.$store.getters["room/info"]?.activeBoard;
    },
    requests() {
      return this.room.requests;
    },
    youKicked() {
      return (
        this.authenticated && this.$store.getters["room/grant"].state === KICKED
      );
    },
    waitForGrant() {
      return (
        this.authenticated &&
        this.$store.getters["room/grant"].state === WAITING
      );
    },
    needRequest() {
      return (
        this.authenticated &&
        this.$store.getters["room/grant"].state === NO_REQUEST
      );
    },
    joined() {
      return (
        this.authenticated && this.$store.getters["room/grant"].state === JOINED
      );
    },
    isOwner() {
      const userId = this.user.id;
      return this.authenticated && this.room.owner === userId;
    }
  },
  data() {
    return {
      milliSecond: null,
      clock_id: null,
      imageSelect: null,
      characterSelect: null
    };
  },
  methods: {
    async dropUser(userId) {
      await FSRoom.DropUser(userId);
    },
    async kickUser(userId) {
      await FSRoom.KickUser(userId);
    },
    async makeRequest() {
      const userId = this.user.id;
      await FSRoom.MakeRequest(userId);
    },
    maybeActive(lastPing) {
      return this.milliSecond - lastPing < 2 * 1000;
    },
    async onClickCreateBoard() {
      const userId = this.user.id;
      const roomId = this.room.id;
      await FSBoard.Create({ userId, roomId });
    },
    async onClickActivateBoard(boardId) {
      const roomId = this.room.id;
      await FSRoom.SetActiveBoard(roomId, boardId);
    },
    async onClickDeleteBoard(boardId) {
      await FSBoard.Delete(boardId);
    },
    async onClickCreateMyCharacter() {
      const { id: userId, name: userName } = this.$store.getters["auth/user"];
      const roomId = this.$store.getters["room/info"].id;
      const { imageSelect } = this;

      const t = Date.now() % 1000;

      const c = {
        owner: userId,
        name: `${userName}_c${t}`,
        roomId,
        imageId: imageSelect
      };
      await FSCharacter.Create(c);
    },
    async onClickCreateAliasToCharacter(characterId) {
      console.log("DebugIndicator.onClickCreateAliasToCharacter", characterId); // @DELETEME
      const character = this.$store.getters["character/info"].find(
        c => c.id === characterId
      );

      const roomId = this.$store.getters["room/info"].id;
      const imageId = this.imageSelect;
      const t = Date.now() % 1000;
      const name = `${character.name}_a${t}`;
      const position = 1;
      const a = {
        roomId,
        characterId,
        imageId,
        name,
        position
      };

      await FSAlias.Create(a);
    },
    async onClickCreatePawn() {
      const userId = this.user.id;
      const roomId = this.room.id;
      const boardId = this.activeBoard;
      const imageId = this.imageSelect;
      const characterId = this.characterSelect;
      await FSPawn.Create({ userId, roomId, boardId, imageId, characterId });
    },
    async onClickFileUploadHandler(e) {
      const { files = [] } = e.currentTarget;

      const promiseList = [];
      files.forEach(f => {
        const { type = "" } = f;
        if (type.indexOf("image") !== -1) {
          promiseList.push(FSImage.Create(f));
        } else if (type.indexOf("video") !== -1) {
          promiseList.push(FSSound.Create(f));
        } else if (type.indexOf("audio") !== -1) {
          promiseList.push(FSSound.Create(f));
        } else {
          console.error(`cannot upload file type: ${type}`); // @DELETEME
        }
      });
      await Promise.all(promiseList);
    },
    async onClickCreateChannel() {
      const c = {
        type: "group",
        name: "新しいチャンネル",
        room: this.room.id
      };
      await FSChannel.Create(c);
    },
    async onClickCreateTable() {
      const t = {
        roomId: this.room.id
      };
      await FSTable.CreateDefault(t);
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
    }
  }
};
</script>
