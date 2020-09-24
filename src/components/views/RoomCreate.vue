<template>
  <div class="container">
    <h3>部屋の作成</h3>
    <ha-input-form label="部屋名" v-model="roomName"></ha-input-form>
    <ha-select label="システム" v-model="system" :items="[{value:'sw2',text:'ソード・ワールド2.0'},{value:'sw2.5',text:'ソード・ワールド2.5'}]"></ha-select>
    <google-authorizer></google-authorizer>
    <ha-button :disabled="!activateCreateRoomButton" @click="onClickCreateRoomButtonHandler">作成</ha-button>
  </div>
</template>

<script>
import { FSRoom } from "@/collections/Room";
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";

export default {
  name: "Room",
  components: { GoogleAuthorizer, HaInputForm, HaSelect, HaButton },
  methods: {
    async onClickCreateRoomButtonHandler() {
      console.log("RoomCreate.onClickCreateRoomButtonHandler"); // @DELETEME
      const { roomName, } = this;

      const user = await FSUser.Create();
      this.$store.dispatch("auth/logInAs", { user });

      const room = await FSRoom.Create({ name: roomName, owner: user });

      await FSUser.JoinRoom(room.owner, room.id);

      this.$router.push(`/r/${room.id}`);
    }
  },
  computed: {
    activateCreateRoomButton() {
      return this.$store.getters["auth/authenticated"];
    }
  },
  data() {
    return {
      roomName: "",
      system: "sw2",
    };
  },
};
</script>

<style scoped>

</style>