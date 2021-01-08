<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div style="width: 100%;height: 100%;overflow-y: scroll;">
    <div v-if="iAmOwner">
      <fieldset :key="r.id" v-for="r in requestItems">
        <legend>入室リクエスト:{{ r.email }}</legend>
        <ha-button @click="onClickGrant(r.id)">許可</ha-button>
        <ha-button @click="onClickKick(r.id)">キック</ha-button>
      </fieldset>
    </div>
    <div v-else>
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
    </div>
    <h5>参加中のユーザ</h5>
    <ul>
      <li :key="u.id" v-for="u in userItems">
        <span
          >{{ isOwner(u.id) ? "★" : "" }}{{ u.email
          }}{{ isMe(u.id) ? "(自分)" : "" }}</span
        >
        <ha-button v-if="iAmOwner && !isMe(u.id)" @click="onClickDrop(u.id)"
          >退室させる</ha-button
        >
        <ha-button v-if="iAmOwner && !isMe(u.id)" @click="onClickKick(u.id)"
          >キック</ha-button
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";
export default {
  name: "RoomManager",
  components: { HaButton },
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
      const requests = this.$store.getters["room/requests"];
      const list = [];
      for (let i = 0; i < userIdList.length; i++) {
        const userId = userIdList[i];
        const { email } = await FSUser.GetById({ id: userId });
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
