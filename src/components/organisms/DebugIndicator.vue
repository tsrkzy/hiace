<template>
  <div>
    <div v-if="joined">
      <h5>Files upload</h5>
      <input type="file" multiple accept="image/*" @change="onClickImagesUploadHandler">
    </div>
    <div v-if="joined">
      <h5>Users</h5>
    </div>
    <div v-if="joined">
      <h5>Images</h5>
    </div>
    <div v-if="isOwner">
      <h5>部屋主メニュー</h5>
      <ha-button :key="`grant-${u}`" v-for="u in requests" @click="grantRequest(u)">grant: {{ u }}</ha-button>
      <ha-button :key="`drop-${u}`" v-for="u in userIdList" @click="dropUser(u)">drop: {{ u }}</ha-button>
      <ha-button :key="`kick-u-${u}`" v-for="u in userIdList" @click="kickUser(u)">kick: {{ u }}</ha-button>
      <ha-button :key="`kick-r-${u}`" v-for="u in requests" @click="kickUser(u)">kick: {{ u }}</ha-button>
    </div>
    <div v-if="youKicked">
      <h5>キックされました</h5>
    </div>
    <div v-if="waitForGrant">
      <h5>入出許可を待っています</h5>
      <p>このタブを閉じて待つこともできます</p>
    </div>
    <div v-if="needRequest">
      <h5>入室リクエストを送る</h5>
      <ha-button @click="makeRequest">入室リクエストを送る</ha-button>
    </div>
    <div v-if="joined">
      <h5>入室完了</h5>
    </div>
    <div v-if="$store.getters['auth/loggedIn']">
      <h5>auth.user</h5>
      <pre>{{ user }}</pre>
    </div>
    <div v-if="$store.getters['room/info']">
      <h5>room.info</h5>
      <pre>{{ room }}</pre>
    </div>
  </div>
</template>

<script>
import { FSImage } from "@/collections/Image";
import { FSRoom } from "@/collections/Room";
import HaButton from "@/components/atoms/HaButton";
import {
  JOINED,
  KICKED,
  NO_REQUEST,
  WAITING
} from "@/store/room";

export default {
  name: "DebugIndicator",
  components: { HaButton },
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    userIdList() {
      return this.room.users;
    },
    users() {
      return this.$store.getters["room/users"]
    },
    room() {
      return this.$store.getters["room/info"];
    },
    requests() {
      return this.room.requests;
    },
    youKicked() {
      return this.authenticated && this.$store.getters["room/grant"].state === KICKED;
    },
    waitForGrant() {
      return this.authenticated && this.$store.getters["room/grant"].state === WAITING;
    },
    needRequest() {
      return this.authenticated && this.$store.getters["room/grant"].state === NO_REQUEST;
    },
    joined() {
      return this.authenticated && this.$store.getters["room/grant"].state === JOINED;
    },
    isOwner() {
      const userId = this.user.id;
      return this.authenticated && this.room.owner === userId;
    },
  },
  methods: {
    async grantRequest(userId) {
      await FSRoom.grantRequest(userId);
    },
    async dropUser(userId) {
      await FSRoom.dropUser(userId);
    },
    async kickUser(userId) {
      await FSRoom.kickUser(userId);
    },
    async makeRequest() {
      const userId = this.user.id;
      await FSRoom.makeRequest(userId);
    },
    async onClickImagesUploadHandler(e) {
      const { files = [] } = e.currentTarget;
      const promiseList = [];
      files.forEach((f) => {
        promiseList.push(FSImage.create(f));
      });
      await Promise.all(promiseList);
    },
  }
};
</script>

<style scoped>

</style>