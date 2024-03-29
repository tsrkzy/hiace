<!-----------------------------------------------------------------------------
  - Copyright (c) 2020.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->
<template>
  <div id="floor" class="floor_container">
    <notice class="z-5"></notice>
    <character-detail class="z-4" />
    <div style="position: fixed; top: 0; left: 0">
      <window-opener v-if="authenticated && joined"></window-opener>
      <button v-if="authenticated && joined" @click="htmlFontSizeHandler(12)">
        12px
      </button>
      <button v-if="authenticated && joined" @click="htmlFontSizeHandler(16)">
        16px
      </button>
      <google-authorizer></google-authorizer>
      <ha-checkbox v-if="false" label="debug:" v-model="debug"></ha-checkbox>
      <debug-indicator v-if="debug"></debug-indicator>
    </div>
    <svg-board ref="svgTable" v-if="joined"></svg-board>
    <context-menu class="z-2" v-if="joined"></context-menu>
    <float-group class="z-1" v-if="joined"></float-group>
    <ha-button
      v-if="authenticated && !joined"
      :disabled="waitForGrant"
      @click="makeRequest"
      >入室リクエスト
    </ha-button>
    <span v-if="waitForGrant">リクエスト受理待ち</span>

    <!-- 音楽の初期ロードとサウンド管理フロート開いてなくても音を鳴らす用 -->
    <sound-manager v-if="joined" v-show="false" :float-id="-1"></sound-manager>
  </div>
</template>

<script>
import { FSAlias } from "@/collections/Alias";
import { FSArrow } from "@/collections/Arrow";
import { FSBoard } from "@/collections/Board";
import { FSChannel } from "@/collections/Channel";
import { FSCharacter } from "@/collections/Character";
import { FSChat } from "@/collections/Chat";
import { FSColumn } from "@/collections/Column";
import { FSDice } from "@/collections/Dice";
import { FSImage } from "@/collections/Image";
import { FSMap } from "@/collections/Map";
import { FSNote } from "@/collections/Note";
import { FSPawn } from "@/collections/Pawn";
import { FSPhrase } from "@/collections/Phrase";
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
import SoundManager from "@/components/organisms/Float/FloatContents/SoundManager";
import FloatGroup from "@/components/organisms/Float/FloatGroup";
import WindowOpener from "@/components/organisms/Float/WindowOpener";
import SvgBoard from "@/components/organisms/Svg/SvgBoard";
import CharacterDetail from "@/components/molecules/CharacterDetail";
import { JOINED, KICKED, NO_REQUEST, WAITING } from "@/store/room";
import { Socket } from "@/scripts/Socket";

import { Smoke } from "@/scripts/Smoke";
import { Notify } from "@/scripts/Notify";

export default {
  name: "Room",
  components: {
    SoundManager,
    CharacterDetail,
    HaCheckbox,
    WindowOpener,
    FloatGroup,
    ContextMenu,
    Notice,
    SvgBoard,
    GoogleAuthorizer,
    HaButton,
    DebugIndicator,
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
      Notify.Log("ルームの初期化に失敗");
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
    FSArrow.RemoveListener(this.roomId);
    FSDice.RemoveListener(this.roomId);
    FSTable.RemoveListener(this.roomId);
    FSColumn.RemoveListener(this.roomId);
    FSNote.RemoveListener(this.roomId);
    FSPhrase.RemoveListener(this.user.id);

    Socket.Dispose();
    this.$store.dispatch("room/leaveRoom");
  },
  methods: {
    htmlFontSizeHandler(px) {
      const $html = document.querySelectorAll("html")[0];
      $html.style.fontSize = `${px}px`;
    },
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
      const userId = this.user.id;

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
      FSArrow.SetListener(roomId);
      FSDice.SetListener(roomId);
      FSTable.SetListener(roomId);
      FSColumn.SetListener(roomId);
      FSNote.SetListener(roomId);
      FSPhrase.SetListener(userId);

      const user = this.$store.getters["auth/user"];
      await FSChat.BroadcastLoggedIn({ roomId, user });

      /* WebSocket */
      new Socket(roomId);
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
    },
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
    },
  },
  data() {
    return {
      roomId: null,
      debug: false,
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
    },
  },
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
