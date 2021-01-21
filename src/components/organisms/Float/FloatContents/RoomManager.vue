<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <fieldset>
      <legend>個人設定</legend>
      <color-picker
        :chat-color="chatColor"
        @change="onChangeColor"
      ></color-picker>
    </fieldset>
    <div v-if="iAmOwner">
      <fieldset :key="r.id" v-for="r in requestItems">
        <legend>入室リクエスト:{{ r.email }}</legend>
        <ha-button @click="onClickGrant(r.id)">許可</ha-button>
        <ha-button @click="onClickKick(r.id)">キック</ha-button>
      </fieldset>
    </div>
    <fieldset v-else>
      <legend>入室状況</legend>
      <div v-if="youKicked">
        <span>キックされました</span>
      </div>
      <div v-if="waitForGrant">
        <span>入出許可待ち</span>
      </div>
      <div v-if="needRequest">
        <ha-button @click="makeRequest">入室リクエストを送る</ha-button>
      </div>
      <div v-if="joined">
        <span>入室済み</span>
      </div>
    </fieldset>
    <fieldset>
      <legend>参加中のユーザ</legend>
      <ul>
        <li :key="u.id" v-for="u in userItems">
          <span
            >{{ isOwner(u.id) ? "★" : "" }}{{ u.email
            }}{{ isMe(u.id) ? "(自分)" : "" }}</span
          >
          <ha-button v-if="iAmOwner && !isMe(u.id)" @click="onClickDrop(u.id)"
            >退室させる
          </ha-button>
          <ha-button v-if="iAmOwner && !isMe(u.id)" @click="onClickKick(u.id)"
            >キック
          </ha-button>
        </li>
      </ul>
    </fieldset>
    <fieldset>
      <legend>素材</legend>
      <a
        target="_blank"
        href="https://on-jin.com/sound/index.php?kensaku=%E3%83%80%E3%82%A4%E3%82%B9"
        >on-jin.com</a
      >
    </fieldset>
  </div>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import ColorPicker from "@/components/molecules/ColorPicker";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";
export default {
  name: "RoomManager",
  components: { ColorPicker, HaButton },
  props: {
    floatId: {
      type: Number,
      require: true
    }
  },
  async created() {
    await this.fetchUser(this.requests);
  },
  computed: {
    user() {
      return this.$store.getters["auth/user"];
    },
    chatColor() {
      return this.user.color;
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
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    },
    iAmOwner() {
      const userId = this.user.id;
      return this.authenticated && this.room.owner === userId;
    },
    room() {
      return this.$store.getters["room/info"];
    },
    requests() {
      return this.room.requests;
    },
    requestItems() {
      return this.$store.getters["room/requests"];
    },
    userItems() {
      return this.$store.getters["user/info"].map(u => ({
        id: u.id,
        email: u.email
      }));
    }
  },
  data() {
    return {};
  },
  methods: {
    async onChangeColor(color) {
      console.log("RoomManager.onChangeColor", color); // @DELETEME
      await FSUser.Update(this.user.id, { color });
    },
    async makeRequest() {
      const userId = this.user.id;
      await FSRoom.MakeRequest(userId);
    },
    async onClickGrant(userId) {
      await FSRoom.GrantRequest(userId);
    },
    async onClickDrop(userId) {
      await FSRoom.DropUser(userId);
    },
    async onClickKick(userId) {
      await FSRoom.KickUser(userId);
    },
    async fetchUser(userIdList) {
      const list = [];
      for (let i = 0; i < userIdList.length; i++) {
        const userId = userIdList[i];
        const { email } = await FSUser.GetById({
          id: userId
        });
        list.push({ id: userId, email });
      }
      await this.$store.dispatch("room/setRequest", { requests: list });
    },
    isMe(userId) {
      return userId === this.$store.getters["auth/user"]?.id;
    },
    isOwner(userId) {
      return this.room.owner === userId;
    }
  },
  watch: {
    requests(requests) {
      this.fetchUser(requests);
    }
  }
};
</script>

<style scoped></style>
