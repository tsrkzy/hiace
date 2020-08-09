<template>
  <div>
    <ha-button @click="$router.push('/')">←</ha-button>
    <google-authorizer></google-authorizer>
    <div v-if="$store.getters['auth/loggedIn']">
      <h5>auth.user</h5>
      <pre>{{ user }}</pre>
    </div>
    <div v-if="$store.getters['room/info']">
      <h5>room.info</h5>
      <pre>{{ room }}</pre>
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
      <ha-button>入室リクエストを送る</ha-button>
    </div>
    <div v-if="joined">
      <h5>入室完了</h5>
    </div>
  </div>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
import {
  JOINED,
  KICKED,
  NO_REQUEST,
  WAITING
} from "@/store/room";

export default {
  name: "Room",
  components: { GoogleAuthorizer, HaButton },
  async created() {
    await this.fetchRoomInfo();
  },
  beforeDestroy() {
    const room = this.$store.getters["room/info"];
    FSRoom.removeListener(room);
  },
  methods: {
    async fetchRoomInfo() {
      if (this.authenticated) {
        return false;
      }
      const roomId = this.$route.params.room_id;
      const room = await FSRoom.getById({ id: roomId });
      FSRoom.setListener(room);
    }
  },
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    room() {
      return this.$store.getters["room/info"];
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
    }
  },
  watch: {
    async authenticated(authenticated) {
      if (authenticated) {
        /* 部屋情報の取得 */
        await this.fetchRoomInfo();
        /* ユーザ情報の取得 */
        const user = await FSUser.create();
        this.$store.dispatch("auth/logInAs", { user });

        const { state } = this.$store.getters["room/grant"];
        /* kick済みの場合 */
        if (state === KICKED) {
          console.error("kicked."); // @DELETEME
        }
        /* 入室申請が未受理 */
        if (state === WAITING) {
          console.log("waiting"); // @DELETEME
        }
        /* 入室申請が出されていない */
        if (state === NO_REQUEST) {
          console.log("send request"); // @DELETEME
        }
        /* 入室済み */
        if (state === JOINED) {
          console.log("joined"); // @DELETEME
        }
      }
    }
  }
};
</script>

<style scoped>

</style>