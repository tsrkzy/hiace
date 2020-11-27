<template>
  <div
    style="width:40vw;height: 90vh;overflow-y: scroll;background-color: lightgray;opacity: 0.7; "
    @contextmenu="onContextmenu"
  >
    <ha-button @click="onClickSmoke">smoke</ha-button>
    <ha-button @click="onClickContext">context</ha-button>
    <div v-if="joined">
      <h5>File upload</h5>
      <input
        type="file"
        multiple
        accept="*/*"
        @change="onClickFileUploadHandler"
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
    <h5>imageSelect</h5>
    {{ imageSelect || "no image" }}
    <details v-if="joined">
      <summary>Images</summary>
      <image-show-case v-model="imageSelect"></image-show-case>
      <!--      <pre>{{ images }}</pre>-->
    </details>
    <details v-if="joined">
      <summary>sounds</summary>
      <ul>
        <li v-for="s in sounds" :key="s.id">
          <sound-editor :sound-id="s.id"></sound-editor>
        </li>
      </ul>
      <ha-button @click="onClickStopMusic">STOP</ha-button>
    </details>
    <details>
      <summary>float.info</summary>
      <ul>
        <li v-for="f in $store.getters['float/info']" :key="f.id">
          {{ f.id }}, {{ f.x }}, {{ f.y }}, {{ f.w }}, {{ f.h }}
        </li>
      </ul>
    </details>
    <div v-if="joined">
      <!-- map -->
      <details>
        <summary>map.info</summary>
        <map-editor v-for="m in maps" :key="m.id" :map-id="m.id"></map-editor>
        <!-- <pre>{{ maps }}</pre>-->
        <ha-button @click="onClickCreateMap">ADD MAP</ha-button>
      </details>
      <!-- pawn -->
      <details>
        <summary>pawn.info</summary>
        <character-show-case v-model="characterSelect"></character-show-case>
        <ha-button @click="onClickCreatePawn">ADD PAWN</ha-button>
        <!--        <pre>{{ pawns }}</pre>-->
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
    <details>
      <summary>user.info</summary>
      <ul>
        <li :key="u.id" v-for="u in users">
          <span>{{ u.id }}</span>
          {{ maybeActive(u.lastPing) ? "●" : "" }}
          <ha-button @click="onClickPing(u.id)">PING</ha-button>
        </li>
      </ul>
    </details>
    <details v-if="room">
      <summary> room.info</summary>
      <pre>{{ room }}</pre>
    </details>
    <details v-if="tables">
      <summary>table.info</summary>
      <pre>{{ $store.getters["table/matrixList"] }}</pre>
      <!--      <pre>{{ tables }}</pre>-->
      <ul>
        <li :key="t.id" v-for="t in tableItems">
          <table-view :table-id="t.id" />
        </li>
      </ul>
      <ha-button @click="onClickCreateTable">ADD TABLE</ha-button>
    </details>
    {{ characterSelect }}
    <details v-if="characters">
      <summary>character.info</summary>
      <ha-button @click="onClickCreateMyCharacter">ADD MY CHARACTER</ha-button>
      <ul>
        <li :key="c.id" v-for="c in characters">
          {{ c.id }}
          <ul>
            <li :key="a.id" v-for="a in c.aliases">{{ a.id }}, {{ a.name }}</li>
          </ul>
          <ha-button @click="onClickCreateAliasToCharacter(c.id)"
            >ADD ALIAS</ha-button
          >
        </li>
      </ul>
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
    <details v-if="chats" open>
      <summary> chat.info</summary>
      <chat-composer v-if="joined"></chat-composer>
      <chat-composer v-if="joined"></chat-composer>
      <ol>
        <li v-for="c of chats" :key="c.id" style="margin: 0;">
          ({{ c.channel || "none" }}) {{ c.character || userName
          }}{{ c.alias ? `(${c.alias})` : "" }}:
          {{ c.type === "DICE" ? c.value.result : c.value.text }}
        </li>
      </ol>
    </details>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSBoard } from "@/collections/Board";
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";
import { FSPawn } from "@/collections/Pawn";
import { FSRoom } from "@/collections/Room";
import { FSSound } from "@/collections/Sound";
import { FSTable } from "@/collections/Table";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import CharacterShowCase from "@/components/molecules/CharacterShowCase";
import ChatComposer from "@/components/molecules/ChatComposer";
import ImageShowCase from "@/components/molecules/ImageShowCase";
import MapEditor from "@/components/molecules/MapEditor";
import SoundEditor from "@/components/molecules/SoundEditor";
import TableView from "@/components/organisms/TableView";
import { Smoke } from "@/scripts/Smoke";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";

export default {
  name: "DebugIndicator",
  components: {
    SoundEditor,
    TableView,
    CharacterShowCase,
    ImageShowCase,
    MapEditor,
    ChatComposer,
    HaButton
  },
  created() {
    this.milliSecond = null;
    const clock = () => {
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
    async onClickPing(userId) {
      await FSUser.Ping(userId);
    },
    maybeActive(lastPing) {
      return this.milliSecond - lastPing < 2 * 1000;
    },
    async onClickStopMusic() {
      await FSRoom.SoundStop(this.room.id);
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
    async onClickCreateMap() {
      const userId = this.user.id;
      const roomId = this.room.id;
      const boardId = this.activeBoard;
      const imageId = this.imageSelect;
      await FSMap.Create({ userId, roomId, boardId, imageId });
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
      const character = this.$store.getters["character/tree"][characterId];

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
    async onClickDeletePawn(pawnId) {
      await FSPawn.Delete(pawnId);
    },
    async onClickSelectCharacter(characterId) {
      this.characterSelect = characterId;
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
    }
  }
};
</script>
