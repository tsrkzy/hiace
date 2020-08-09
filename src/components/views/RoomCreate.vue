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
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  name: "Room",
  components: { GoogleAuthorizer, HaInputForm, HaSelect, HaButton },
  methods: {
    async onClickCreateRoomButtonHandler() {
      console.log("RoomCreate.onClickCreateRoomButtonHandler"); // @DELETEME
      const db = firebase.firestore();

      const { roomName, } = this;

      /* get User or create User */
      const user = await FSUser.create();
      this.$store.dispatch("auth/logInAs", { user });

      const room = {
        name: roomName,
        owner: user.id, // 部屋作成時に固定
        keepers: [user.id], // 初期値ownerのみ、追加削除可能
        requests: [],
        kicked: [],
        users: [user.id], // 初期値ownerのみ、追加可能
        characters: [],
        // logs: ["log_1", "log_2"],
        // resources: ["resource_1"], // 共有リソース
        // gameSystem: "cthuluhu",
        // activeMap: "map_1", // マップセット切り替え
        // maps: ["map_1", "map_2"],
        /* watchして再生切り替える必要あり */
        // soundEffects: ["soundEffect_1", "soundEffect_2"],
        // musics: "music_1"
      };
      const roomDocRef = await db.collection("room").add(room);
      const roomId = roomDocRef.id;
      this.$router.push(`/r/${roomId}`);
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