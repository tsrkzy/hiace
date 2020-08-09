<template>
  <div class="container">
    <h3>部屋の作成</h3>
    <ha-input-form label="部屋名" v-model="roomName"></ha-input-form>
    <ha-input-form label="パスワード" v-model="roomPassword" placeholder="暗号化してません。"></ha-input-form>
    <ha-select label="システム" v-model="system" :items="[{value:'sw2',text:'ソード・ワールド2.0'},{value:'sw2.5',text:'ソード・ワールド2.5'}]"></ha-select>
    <ha-button :disabled="!activateCreateRoomButton" @click="onClickCreateRoomButtonHandler">作成</ha-button>
  </div>
</template>

<script>
import HaButton from "@/components/atoms/HaButton";
import HaInputForm from "@/components/atoms/HaInputForm";
import HaSelect from "@/components/atoms/HaSelect";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

export default {
  name: "Room",
  components: { HaInputForm, HaSelect, HaButton },
  methods: {
    async onClickCreateRoomButtonHandler() {
      console.log("RoomCreate.onClickCreateRoomButtonHandler"); // @DELETEME
      const db = firebase.firestore();
      const me = firebase.auth().currentUser;

      const {
        roomName,
        roomPassword
      } = this;

      const user = {
        name: me.displayName,
        photoUrl: me.photoURL,
        email: me.email,
      };
      const userDocRef = await db.collection("user").add(user);
      const userId = userDocRef.id;
      const room = {
        auth: {
          password: roomPassword,
        },
        name: roomName,
        owner: userId, // 部屋作成時に固定
        keepers: [userId], // 初期値ownerのみ、追加削除可能
        requests: [],
        kicked: [],
        users: [userId], // 初期値ownerのみ、追加可能
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
      return this.$store.getters["auth/loggedIn"];
    }
  },
  data() {
    return {
      roomName: "",
      roomPassword: "",
      system:"sw2",
    };
  },
};
</script>

<style scoped>

</style>