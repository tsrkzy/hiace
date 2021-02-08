<template>
  <div class="container">
    <fieldset class="create-room__fieldset">
      <legend>部屋の作成</legend>
      <ha-input-form
        label="部屋名"
        v-model="roomName"
        placeholder="必須"
      ></ha-input-form>
      <ha-select label="システム" v-model="gameSystem" :items="systemList">
        <option :value="null" selected disabled>ダイスシステム(必須)</option>
      </ha-select>
      <div>
        <ha-button
          :disabled="!activateCreateRoomButton"
          @click="onClickCreateRoomButtonHandler"
          >作成
        </ha-button>
      </div>
      <p v-if="!authenticated">Googleアカウントでのログインが必要です</p>
      <powered-by />
    </fieldset>
    <google-authorizer></google-authorizer>
  </div>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
import PoweredBy from "@/components/views/PoweredBy";
import { GAME_SYSTEMS } from "@/scripts/diceBot";
import { Notify } from "@/scripts/Notify";
import { Smoke } from "@/scripts/Smoke";
import { Socket } from "@/scripts/Socket";

export default {
  name: "Room",
  components: {
    PoweredBy,
    GoogleAuthorizer,
    HaInputForm,
    HaSelect,
    HaButton
  },
  methods: {
    async onClickCreateRoomButtonHandler() {
      console.log("RoomCreate.onClickCreateRoomButtonHandler"); // @DELETEME
      const { roomName } = this;

      await Smoke.on();
      try {
        const user = await FSUser.Create();
        await this.$store.dispatch("auth/logInAs", { user });

        const room = await FSRoom.Create({
          name: roomName,
          owner: user.id,
          gameSystem: this.gameSystem
        });

        await FSUser.JoinRoom(user.id, room.id);

        /* WebSocket */
        new Socket(room.id);

        /* RTC接続の最小単位を作成 */
        // await FSNegotiation.AddNode(room.id, user.id);

        await Smoke.off();
        await this.$router.push(`/r/${room.id}`);
      } catch (e) {
        console.error(e);
        Notify.Log("Room.create() failed");
      }
      await Smoke.off();
    }
  },
  computed: {
    activateCreateRoomButton() {
      return (
        this.$store.getters["auth/authenticated"] &&
        this.gameSystem &&
        this.roomName.trim()
      );
    },
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    }
  },
  data() {
    return {
      roomName: "",
      gameSystem: null,
      systemList: GAME_SYSTEMS
    };
  }
};
</script>

<style scoped lang="scss">
fieldset.create-room__fieldset {
  width: 40vw;
  margin: 5vh 30vw;
}
</style>
