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
      <ha-button :disabled="!authenticated" @click="onClickCreateCharacter"
        >ADD CHARACTER
      </ha-button>
      <!--      <pre>      {{ characters }}</pre>-->
    </details>
    <details v-if="joined" open>
      <summary>alias.info</summary>
      <ha-button :disabled="!authenticated" @click="onClickCreateAlias"
        >ADD Alias
      </ha-button>
      <!--      <pre>{{ aliases }}</pre>-->
      <ol>
        <li v-for="a in aliases" :key="a.id" style="margin: 0;">
          {{ a.character }}:{{ a.name }}
        </li>
      </ol>
    </details>
    <character-switcher v-if="joined"></character-switcher>
    <details v-if="channels">
      <summary>channel.info</summary>
      <ha-button :disabled="!authenticated" @click="onClickCreateChannel"
        >ADD CHANNEL
      </ha-button>
      <!--      <pre>{{ channels }}</pre>-->
    </details>
    <chat-composer v-if="joined"></chat-composer>
    <details v-if="chats" open>
      <summary> chat.info</summary>
      <ol>
        <li v-for="c of chats" :key="c.id" style="margin: 0;">
          ({{ c.channel || "none" }}) {{ c.character || userName }}:
          {{ c.value.text }}
        </li>
      </ol>
      <!--      <pre>{{ chats }}</pre>-->
    </details>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSChannel } from "@/collections/Channel";
import { CHARACTER_NOT_SELECTED, FSCharacter } from "@/collections/Character";
import { FSImage } from "@/collections/Image";
import { FSRoom } from "@/collections/Room";
import HaButton from "@/components/atoms/HaButton";
import CharacterSwitcher from "@/components/molecules/CharacterSwitcher";
import ChatComposer from "@/components/molecules/ChatComposer";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";

export default {
  name: "DebugIndicator",
  components: { CharacterSwitcher, ChatComposer, HaButton },
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
      return this.$store.getters["character/info"];
    },
    characterSelected() {
      return this.$store.getters["character/activeId"];
    },
    aliases() {
      return this.$store.getters["alias/info"];
    },
    channelItems() {
      return this.$store.getters["channel/info"].map(c => ({
        text: c.name,
        value: c.id
      }));
    },
    chats() {
      return this.$store.getters["chat/info"];
    },
    images() {
      return this.$store.getters["image/info"];
    },
    imageItems() {
      return this.$store.getters["image/info"].map(img => ({
        id: img.id,
        url: img.url
      }));
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
    },
    async onClickCreateAlias() {
      const { characterSelected: characterId } = this;
      if (characterId === CHARACTER_NOT_SELECTED) {
        console.warn("character not selected yet"); // @DELETEME
        return false;
      }

      const character = this.characters.find(c => c.id === characterId);

      const roomId = this.rooms.id;
      const imageId = null;
      const name = `${character.name}の新しいalias`;
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
    async onClickCreateCharacter() {
      const userId = this.user.id;
      const userName = this.user.name;
      const roomId = this.rooms.id;
      const c = {
        owner: userId,
        name: `${userName}_character`,
        roomId
      };
      await FSCharacter.Create(c);
    }
  }
};
</script>

<style scoped></style>
