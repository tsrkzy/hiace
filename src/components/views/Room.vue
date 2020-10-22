<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<template>
  <div
    id="floor"
    style="margin: 40px;border: 1px solid black;overflow: hidden;"
  >
    <div style="position: fixed; top: 0;left:0;">
      <ha-button @click="$router.push('/')">←</ha-button>
      <google-authorizer></google-authorizer>
      <label
        >debug:
        <input type="checkbox" v-model="debug" />
      </label>
      <debug-indicator v-if="debug"></debug-indicator>
    </div>
    <svg-board ref="svgTable"></svg-board>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSBoard } from "@/collections/Board";
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSChat } from "@/collections/Chat";
import { FSPawn } from "@/collections/Pawn";
import { FSRoom } from "@/collections/Room";
import { FSTable } from "@/collections/Table";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
import DebugIndicator from "@/components/organisms/DebugIndicator";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";
import SvgBoard from "@/components/organisms/SvgBoard";

const WINDOW_MARGIN = 40;
const BORDER = 1;

export default {
  name: "Room",
  components: { SvgBoard, GoogleAuthorizer, HaButton, DebugIndicator },
  async created() {
    this.roomId = this.$route.params.room_id;
    await this.trackRoomInfo(this.roomId);
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
    this.resizeHandler();
  },
  beforeDestroy() {
    console.log("Room.beforeDestroy", this.roomId); // @DELETEME
    window.removeEventListener("resize", this.resizeHandler);

    FSRoom.RemoveListener(this.roomId);
    FSUser.RemoveListener();
    FSChat.RemoveListener(this.roomId);
    FSChannel.RemoveListener();
    FSCharacter.RemoveListener(this.roomId);
    FSAlias.RemoveListener(this.roomId);
    FSImage.RemoveListener(this.roomId);
    FSBoard.RemoveListener(this.roomId);
    FSMap.RemoveListener(this.roomId);
    FSPawn.RemoveListener(this.roomId);
    FSTable.RemoveListener(this.roomId);
    this.$store.dispatch("room/leaveRoom");
  },
  methods: {
    async trackRoomInfo(roomId) {
      /* google未認証のユーザには部屋情報を渡さない */
      if (!this.authenticated) {
        return false;
      }

      await FSRoom.GetById({ id: roomId });
      FSRoom.SetListener(roomId);
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
      FSBoard.SetListener(roomId);
      FSMap.SetListener(roomId);
      FSPawn.SetListener(roomId);
      FSTable.SetListener(roomId);

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
    },
    resizeHandler() {
      const $el = document.getElementById("floor");
      const height = window.innerHeight - 2 * WINDOW_MARGIN - 2 * BORDER;
      $el.style.height = `${height}px`;
      const width = window.innerWidth - 2 * WINDOW_MARGIN - 2 * BORDER;
      $el.style.width = `${width}px`;
      this.$refs.svgTable.resize(width, height);
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
      return (
        this.authenticated && this.$store.getters["room/grant"].state === JOINED
      );
    },
    grantState() {
      return this.$store.getters["room/grant"].state;
    }
  },
  data() {
    return {
      roomId: null,
      debug: true
    };
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
