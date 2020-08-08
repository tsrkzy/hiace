<template>
  <div class="container">
    <h3>部屋の作成</h3>
    <label>
      <span>部屋名</span>
      <input v-model="roomName">
    </label>
    <label>
      <span>パスワード</span>
      <input placeholder="暗号化してません。" v-model="roomPassword">
    </label>
    <label>
      <span>システム</span>
      <select>
        <option value="1">ソード・ワールド 2.0</option>
        <option value="2">ソード・ワールド 2.5</option>
      </select>
    </label>
    <ha-button :disabled="!activateCreateRoomButton" @click="onClickCreateRoomButtonHandler">作成</ha-button>
  </div>
</template>

<script>
import HaButton from "@/components/atoms/HaButton";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

export default {
  name: "Room",
  components: { HaButton },
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
    };
  },
};
</script>

<style scoped>

</style>