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
      <h5>個別のチャンネル(全体以外)への発言</h5>
      <ha-checkbox
        label="発言内容を伏せる"
        :value="maskChannel"
        @change="onMaskHandler"
      ></ha-checkbox>
      <h5>タブが非アクティブの時に通知音を鳴らす</h5>
      <ha-checkbox
        label="新着チャットを通知する"
        :value="ring"
        @change="onRingHandler"
      ></ha-checkbox>
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
            >{{ isOwner(u.id) ? "[admin] " : "" }}{{ u.email
            }}{{ isMe(u.id) ? "(自分)" : "" }}</span
          >
          <ha-button
            v-if="enableBan && iAmOwner && !isMe(u.id)"
            @click="onClickDrop(u.id)"
            >退室させる
          </ha-button>
          <ha-button
            v-if="enableBan && iAmOwner && !isMe(u.id)"
            @click="onClickKick(u.id)"
            >キック
          </ha-button>
        </li>
      </ul>
      <ha-checkbox
        v-if="iAmOwner"
        v-model="enableBan"
        label="追放操作を有効にする"
      ></ha-checkbox>
    </fieldset>
    <fieldset>
      <legend>DL</legend>
      <chat-download-button />
      <chat-truncate-button />
    </fieldset>
    <fieldset>
      <legend>外部サイト</legend>
      <p>
        <a
          target="_blank"
          href="https://on-jin.com/sound/index.php?kensaku=%E3%83%80%E3%82%A4%E3%82%B9"
          >on-jin.com</a
        ><span>(フリー効果音、BGM)</span>
      </p>
      <p>
        <a href="https://github.com/tsrkzy/hiace/wiki" target="_blank"
          >使い方(Wiki/Github)</a
        >
      </p>
    </fieldset>
  </div>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import ColorPicker from "@/components/molecules/ColorPicker";
import ChatDownloadButton from "@/components/organisms/Float/FloatContents/ChatDownloadButton";
import ChatTruncateButton from "@/components/organisms/Float/FloatContents/ChatTruncateButton";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";

export default {
  name: "RoomManager",
  components: {
    ChatTruncateButton,
    HaCheckbox,
    ChatDownloadButton,
    ColorPicker,
    HaButton
  },
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
    return {
      enableBan: false,
      maskChannel: this.$store.getters["localConfig/maskChannel"],
      ring: this.$store.getters["localConfig/ring"]
    };
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
    async onMaskHandler(e) {
      const payload = { maskChannel: !!e };
      await this.$store.dispatch("localConfig/setMaskChannel", payload);
    },
    async onRingHandler(e) {
      const payload = { ring: !!e };
      await this.$store.dispatch("localConfig/setRing", payload);
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
