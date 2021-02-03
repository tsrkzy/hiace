<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<template>
  <div id="floor" class="floor_container">
    <notice></notice>
    <character-detail />
    <div style="position: fixed; top: 0;left:0;">
      <ha-button @click="$router.push('/')">←</ha-button>
      <window-opener v-if="authenticated && joined"></window-opener>
      <google-authorizer></google-authorizer>
      <ha-checkbox v-if="false" label="debug:" v-model="debug"></ha-checkbox>
      <debug-indicator v-if="debug"></debug-indicator>
    </div>
    <svg-board ref="svgTable" v-if="joined"></svg-board>
    <float-group v-if="joined"></float-group>
    <context-menu v-if="joined"></context-menu>
    <ha-button
      v-if="authenticated && !joined"
      :disabled="waitForGrant"
      @click="makeRequest"
      >入室リクエスト
    </ha-button>
    <span v-if="waitForGrant">リクエスト受理待ち</span>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSBoard } from "@/collections/Board";
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSChat } from "@/collections/Chat";
import { FSColumn } from "@/collections/Column";
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";
import { FSNegotiation } from "@/collections/Negotiation";
import { FSNote } from "@/collections/Note";
import { FSPawn } from "@/collections/Pawn";
import { FSRoom } from "@/collections/Room";
import { FSSound } from "@/collections/Sound";
import { FSTable } from "@/collections/Table";
import { FSUser } from "@/collections/User";
import ContextMenu from "@/components/atoms/ContextMenu";
import HaButton from "@/components/atoms/HaButton";
import HaCheckbox from "@/components/atoms/HaCheckbox";
import Notice from "@/components/atoms/Notice";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
import DebugIndicator from "@/components/organisms/DebugIndicator";
import FloatGroup from "@/components/organisms/Float/FloatGroup";
import WindowOpener from "@/components/organisms/Float/WindowOpener";
import SvgBoard from "@/components/organisms/Svg/SvgBoard";
import CharacterDetail from "@/components/views/CharacterDetail";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";

import { Smoke } from "@/scripts/Smoke";
import { Notify } from "@/scripts/Notify";

export default {
  name: "Room",
  components: {
    CharacterDetail,
    HaCheckbox,
    WindowOpener,
    FloatGroup,
    ContextMenu,
    Notice,
    SvgBoard,
    GoogleAuthorizer,
    HaButton,
    DebugIndicator
  },
  async created() {
    await Smoke.on();
    try {
      this.roomId = this.$route.params.room_id;
      await this.trackRoomInfo(this.roomId);
      await this.$store.dispatch("float/initialize");
      await this.$nextTick();
    } catch (e) {
      console.error(e);
      Notify.Log("Room.initialize() failed.");
    }
    await Smoke.off();
  },
  mounted() {},
  beforeDestroy() {
    console.log("Room.beforeDestroy", this.roomId); // @DELETEME

    FSRoom.RemoveListener(this.roomId);
    FSUser.RemoveListener();
    FSChat.RemoveListener(this.roomId);
    FSChannel.RemoveListener();
    FSCharacter.RemoveListener(this.roomId);
    FSAlias.RemoveListener(this.roomId);
    FSImage.RemoveListener(this.roomId);
    FSSound.RemoveListener(this.roomId);
    FSBoard.RemoveListener(this.roomId);
    FSMap.RemoveListener(this.roomId);
    FSPawn.RemoveListener(this.roomId);
    FSTable.RemoveListener(this.roomId);
    FSColumn.RemoveListener(this.roomId);
    FSNote.RemoveListener(this.roomId);
    FSNegotiation.RemoveListener(this.roomId);
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
      FSSound.SetListener(roomId);
      FSBoard.SetListener(roomId);
      FSMap.SetListener(roomId);
      FSPawn.SetListener(roomId);
      FSTable.SetListener(roomId);
      FSColumn.SetListener(roomId);
      FSNote.SetListener(roomId);
      FSNegotiation.SetListener(roomId);
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
        console.log("no request"); // @DELETEME
      }
      /* 入室許可済み */
      if (state === JOINED) {
        console.log("joined"); // @DELETEME
        await this.afterJoined();
      }
    },
    async makeRequest() {
      const userId = this.user.id;
      await FSRoom.MakeRequest(userId);
    }
  },
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    },
    room() {
      return this.$store.getters["room/info"];
    },
    user() {
      return this.$store.getters["auth/user"];
    },
    joined() {
      return (
        this.authenticated && this.$store.getters["room/grant"].state === JOINED
      );
    },
    waitForGrant() {
      return (
        this.authenticated &&
        this.$store.getters["room/grant"].state === WAITING
      );
    },
    grantState() {
      return this.$store.getters["room/grant"].state;
    }
  },
  data() {
    return {
      roomId: null,
      debug: false
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
      await this.$store.dispatch("auth/logInAs", { user });

      /* RTC接続の最小単位を作成 */
      // const tab = FSUser.GetTab(roomId, user.id);
      // await FSRoom.AddTab(roomId, tab);
      const node = await FSNegotiation.AddNode(roomId, user.id);
      console.log(node); // @DELETEME
    }
  }
};
</script>

<style scoped lang="scss">
div.floor_container {
  margin: 40px;
  border: 1px solid black;
  overflow: hidden;
  width: calc(100vw - 80px);
  height: calc(100vh - 80px);
}
</style>
