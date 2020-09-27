<template>
  <div>
    <ha-button @click="$router.push('/')">←</ha-button>
    <google-authorizer></google-authorizer>
    <debug-indicator></debug-indicator>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSChat } from "@/collections/Chat";
import { FSRoom } from "@/collections/Room";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
import DebugIndicator from "@/components/organisms/DebugIndicator";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";
import { FSImage } from "../../collections/Image";

export default {
  name: "Room",
  components: { GoogleAuthorizer, HaButton, DebugIndicator },
  async created() {
    const roomId = this.$route.params.room_id;
    await this.trackRoomInfo(roomId);
  },
  beforeDestroy() {
    FSRoom.RemoveListener(this.roomId);
    FSUser.RemoveListener();
    FSChat.RemoveListener(this.roomId);
    FSChannel.RemoveListener();
    FSCharacter.RemoveListener(this.roomId);
    FSAlias.RemoveListener(this.roomId);
    FSImage.RemoveListener(this.roomId);
  },
  methods: {
    async trackRoomInfo(roomId) {
      /* google未認証のユーザには部屋情報を渡さない */
      if (!this.authenticated) {
        return false;
      }

      const room = await FSRoom.GetById({ id: roomId });
      FSRoom.SetListener(room);
    },
    async afterJoined() {
      /* google認証、入室申請受理済み */
      const roomId = this.roomId;

      FSUser.SetListener(roomId);
      FSChat.SetListener(roomId);
      FSChannel.SetListener(roomId);
      FSCharacter.SetListener(roomId);
      FSAlias.SetListener(roomId);
      FSImage.SetListener(roomId);

      const user = this.$store.getters["auth/user"];
      await FSChat.BroadcastLoggedIn({ roomId, user });
    },
    afterKicked() {},
    afterWaiting() {},
    async grantStateController() {
      const { state } = this.$store.getters["room/grant"];

      /* kick済み */
      if (state === KICKED) {
        console.error("kicked."); // @DELETEME
        this.afterKicked();
      }
      /* 入室申請が未受理 */
      if (state === WAITING) {
        console.log("waiting"); // @DELETEME
        this.afterWaiting();
      }
      /* 入室申請が未提出 */
      if (state === NO_REQUEST) {
        console.log("send request"); // @DELETEME
      }
      /* 入室許可済み */
      if (state === JOINED) {
        console.log("joined"); // @DELETEME
        await this.afterJoined();
      }
    }
  },
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    },
    roomId() {
      return this.$route.params.room_id;
    },
    room() {
      return this.$store.getters["room/info"];
    },
    joined() {
      return (
        this.authenticated && this.$store.getters["room/grant"].state === JOINED
      );
    },
    grantState() {
      return this.$store.getters["room/grant"].state;
    }
  },
  watch: {
    async grantState() {
      /* 入室申請の提出・承認状態の監視 */
      if (!this.authenticated) {
        /* google未認証の場合は無視 */
        return false;
      }
      await this.grantStateController();
    },
    async authenticated(authenticated) {
      /* google認証の監視 */
      console.log("Room.authenticated → ", authenticated); // @DELETEME
      if (!authenticated) {
        return false;
      }

      /* google認証に通ったら部屋情報を渡す */
      const roomId = this.roomId;
      await this.trackRoomInfo(roomId);

      /* FS上にGoogle認証と対応するユーザを作成、または取得 */
      const user = await FSUser.Create();
      this.$store.dispatch("auth/logInAs", { user });
    }
  }
};
</script>

<style scoped></style>
