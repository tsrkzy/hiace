<template>
  <div>
    <div v-if="joined">
      <h5>Files upload</h5>
      <input
        type="file"
        multiple
        accept="image/*"
        @change="onClickImagesUploadHandler"
      />
    </div>
    {{ activeBoard }}
    <details v-if="joined">
      <summary>Boards</summary>
      <ha-button @click="onClickCreateBoard">ADD BOARD</ha-button>
      <ul>
        <li v-for="b in boardItems" :key="b.id">
          <ha-button @click="onClickActivateBoard(b.id)">
            {{ activeBoard === b.id ? "*" : "" }}ACTIVATE: {{ b.name }}
          </ha-button>
          <ha-button @click="onClickDeleteBoard(b.id)"
            >DELETE: {{ b.id }}
          </ha-button>
        </li>
      </ul>
      <pre>{{ boards }}</pre>
    </details>
    {{ imageSelect || "no image" }}
    <details v-if="joined">
      <summary>Images</summary>
      <pre>{{ images }}</pre>
    </details>
    <div v-if="joined">
      <label
        v-for="img of imageItems"
        :key="img.id"
        style="display: inline-block;"
      >
        <input
          type="radio"
          name="image_select"
          :value="img.id"
          v-model="imageSelect"
          v-show="false"
        />
        <img
          :src="img.url"
          :style="{
            'max-width': '24px',
            'max-height': '24px',
            'border-bottom': imageSelect === img.id ? '1px solid black' : 'none'
          }"
        />
      </label>
      <!-- map -->
      <ha-button @click="onClickCreateMap">ADD MAP</ha-button>
      <details>
        <summary>map.info</summary>
        <map-editor v-for="m in maps" :key="m.id" :map-id="m.id"></map-editor>
        <pre>{{ maps }}</pre>
      </details>
      <!-- pawn -->
      <ha-button @click="onClickCreatePawn">ADD PAWN</ha-button>
      <details>
        <summary>pawn.info</summary>
        <pawn-editor
          v-for="p in pawns"
          :key="p.id"
          :pawn-id="p.id"
        ></pawn-editor>
        <pre>{{ pawns }}</pre>
      </details>
    </div>
    <details v-if="isOwner">
      <summary>owner menu</summary>
      <ha-button
        :key="`grant-${u}`"
        v-for="u in requests"
        @click="grantRequest(u)"
        >grant: {{ u }}
      </ha-button>
      <ha-button :key="`drop-${u}`" v-for="u in userIdList" @click="dropUser(u)"
        >drop: {{ u }}
      </ha-button>
      <ha-button
        :key="`kick-u-${u}`"
        v-for="u in userIdList"
        @click="kickUser(u)"
        >kick: {{ u }}
      </ha-button>
      <ha-button :key="`kick-r-${u}`" v-for="u in requests" @click="kickUser(u)"
        >kick: {{ u }}
      </ha-button>
    </details>
    <div v-if="youKicked">
      <span>キックされました</span>
    </div>
    <div v-if="waitForGrant">
      <span>入出許可を待っています。このタブを閉じて待つこともできます。</span>
    </div>
    <div v-if="needRequest">
      <span>入室リクエストを送る</span>
      <ha-button @click="makeRequest">入室リクエストを送る</ha-button>
    </div>
    <div v-if="joined">
      <span>入室完了</span>
    </div>
    <details v-if="$store.getters['auth/loggedIn']">
      <summary> auth.user</summary>
      <img
        width="25"
        height="25"
        :src="$store.getters['auth/photoUrl']"
        alt="user-icon"
        style="border: 1px solid lightgray;"
      />
      <pre>{{ user }}</pre>
    </details>
    <details v-if="rooms">
      <summary> room.info</summary>
      <pre>{{ rooms }}</pre>
    </details>
    <details v-if="characters">
      <summary>character.info</summary>
      <pre>      {{ characters }}</pre>
    </details>
    <details v-if="joined">
      <summary>alias.info</summary>
      <pre>{{ aliases }}</pre>
    </details>
    <details v-if="channels">
      <summary>channel.info</summary>
      <ha-button :disabled="!authenticated" @click="onClickCreateChannel"
        >ADD CHANNEL
      </ha-button>
      <pre>{{ channels }}</pre>
    </details>
    <chat-composer v-if="joined"></chat-composer>
    <chat-composer v-if="joined"></chat-composer>
    <details v-if="chats" open>
      <summary> chat.info</summary>
      <ol>
        <li v-for="c of chats" :key="c.id" style="margin: 0;">
          ({{ c.channel || "none" }}) {{ c.character || userName
          }}{{ c.alias ? `(${c.alias})` : "" }}:
          {{ c.value.text }}
        </li>
      </ol>
      <!--      <pre>{{ chats }}</pre>-->
    </details>
  </div>
</template>

<script>
import { FSBoard } from "@/collections/Board";
import { FSChannel } from "@/collections/Channel";
import { FSImage } from "@/collections/Image";
import { FSPawn } from "@/collections/Pawn";
import { FSRoom } from "@/collections/Room";
import HaButton from "@/components/atoms/HaButton";
import ChatComposer from "@/components/molecules/ChatComposer";
import MapEditor from "@/components/molecules/MapEditor";
import PawnEditor from "@/components/molecules/PawnEditor";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";
import { FSMap } from "@/collections/Map";

export default {
  name: "DebugIndicator",
  components: { PawnEditor, MapEditor, ChatComposer, HaButton },
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
      return this.rooms.users;
    },
    users() {
      return this.$store.getters["room/users"];
    },
    rooms() {
      return this.$store.getters["room/info"];
    },
    channels() {
      return this.$store.getters["channel/info"];
    },
    characters() {
      return this.$store.getters["character/tree"];
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
    boards() {
      return this.$store.getters["board/info"];
    },
    maps() {
      return this.$store.getters["map/info"];
    },
    pawns() {
      return this.$store.getters["pawn/info"];
    },
    imageItems() {
      return this.$store.getters["image/info"].map(img => ({
        id: img.id,
        url: img.url
      }));
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
      return this.rooms.requests;
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
      return this.authenticated && this.rooms.owner === userId;
    }
  },
  data() {
    return {
      imageSelect: null
    };
  },
  methods: {
    async grantRequest(userId) {
      await FSRoom.GrantRequest(userId);
    },
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
    async onClickCreateBoard() {
      const userId = this.user.id;
      const roomId = this.rooms.id;
      await FSBoard.Create({ userId, roomId });
    },
    async onClickActivateBoard(boardId) {
      const roomId = this.rooms.id;
      await FSRoom.SetActiveBoard(roomId, boardId);
    },
    async onClickDeleteBoard(boardId) {
      await FSBoard.Delete(boardId);
    },
    async onClickCreateMap() {
      const userId = this.user.id;
      const roomId = this.rooms.id;
      const boardId = this.activeBoard;
      const imageId = this.imageSelect;
      await FSMap.Create({ userId, roomId, boardId, imageId });
    },
    async onClickCreatePawn() {
      const userId = this.user.id;
      const roomId = this.rooms.id;
      const boardId = this.activeBoard;
      const imageId = this.imageSelect;
      const characterId = "this.characterId";
      await FSPawn.Create({ userId, roomId, boardId, imageId, characterId });
    },
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    },

    async onClickImagesUploadHandler(e) {
      const { files = [] } = e.currentTarget;
      const promiseList = [];
      files.forEach(f => {
        promiseList.push(FSImage.Create(f));
      });
      await Promise.all(promiseList);
    },
    async onClickCreateChannel() {
      const c = {
        type: "group",
        name: "新しいチャンネル",
        room: this.rooms.id
      };
      await FSChannel.Create(c);
    }
  }
};
</script>

<style scoped></style>
