<template>
  <div>
    <ha-button @click="$router.push('/')">←</ha-button>
    <google-authorizer></google-authorizer>
    <debug-indicator></debug-indicator>
  </div>
</template>

<script>
import { FSChat } from "@/collections/Chat";
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
      /* 認証済みのまま入室した場合: 部屋作成後 */
      const roomId = this.$route.params.room_id;
      await this.fetchRoomInfo(roomId);

      FSChat.SetListener(roomId);
    }
  },
  beforeDestroy() {
    FSRoom.RemoveListener(this.room.id);
  },
  methods: {
    async fetchRoomInfo(roomId) {
      const room = await FSRoom.GetById({ id: roomId });

      FSRoom.SetListener(room);
    },
    afterJoined() {
      /* 申請が許可された直後の入室 */
      const roomId = this.room.id;
      FSUser.setListener(roomId);

      FSChat.SetListener(roomId);
    },
    afterKicked() {
    },
    afterWaiting() {
    },
    async grantStateControler() {
      const { state } = this.$store.getters["room/grant"];

      /* URL直(未認証) && kick済み */
      if (state === KICKED) {
        console.error("kicked."); // @DELETEME
        this.afterKicked();
      }
      /* URL直(未認証) && 入室申請が未受理 */
      if (state === WAITING) {
        console.log("waiting"); // @DELETEME
        this.afterWaiting();
      }
      /* URL直(未認証) && 入室申請が未提出 */
      if (state === NO_REQUEST) {
        console.log("send request"); // @DELETEME
      }
      /* URL直(未認証) && 入室許可済み */
      if (state === JOINED) {
        console.log("joined"); // @DELETEME
        this.afterJoined();
      }
    }
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
    grantState() {
      return this.$store.getters["room/grant"].state;
    }
  },
  watch: {
    async grantState() {
      if (!this.authenticated) {
        /* 未認証の場合は無視 */
        return false;
      }
      this.grantStateControler();
    },
    async authenticated(authenticated) {
      console.log("Room.authenticated → ", authenticated); // @DELETEME
      if (!authenticated) {
        /* 認証状態が解除されたら @TODO */
        return false;
      }

      const roomId = this.$route.params.room_id;
      await this.fetchRoomInfo(roomId);

      /* FS上にGoogleと対応するユーザを作成 */
      const user = await FSUser.create();
      this.$store.dispatch("auth/logInAs", { user });

    }
  }
};
</script>

<style scoped>

</style>