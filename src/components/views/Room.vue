<template>
  <div>
    <ha-button @click="$router.push('/')">←</ha-button>
    <google-authorizer></google-authorizer>
    <debug-indicator></debug-indicator>
  </div>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
import DebugIndicator from "@/components/organisms/DebugIndicator";
import {
  JOINED,
  KICKED,
  NO_REQUEST,
  WAITING
} from "@/store/room";

export default {
  name: "Room",
  components: { GoogleAuthorizer, HaButton, DebugIndicator },
  async created() {
    if (this.authenticated) {
      /* 認証済みのまま入室した場合 */
      await this.fetchRoomInfo();
    }
  },
  beforeDestroy() {
    FSRoom.removeListener(this.room);
  },
  methods: {
    async fetchRoomInfo() {
      const roomId = this.$route.params.room_id;
      const room = await FSRoom.getById({ id: roomId });
      FSRoom.setListener(room);
    },
  },
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    },
    room() {
      return this.$store.getters["room/info"];
    },
    joined() {
      return this.authenticated && this.$store.getters["room/grant"].state === JOINED;
    },
  },
  watch: {
    async authenticated(authenticated) {
      if (authenticated) {
        /* URL直などで、部屋に遷移 */

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