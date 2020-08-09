<template>
  <div>
    <ha-button @click="$router.push('/')">←</ha-button>
    <google-authorizer></google-authorizer>
    <div v-if="$store.getters['auth/loggedIn']">
      <h5>auth.user</h5>
      <pre>{{ user }}</pre>
    </div>
    <div v-if="$store.getters['room/info']">
      <h5>room.info</h5>
      <pre>{{ room }}</pre>
    </div>
  </div>
</template>

<script>
import { FSUser } from "@/collections/User";
import HaButton from "@/components/atoms/HaButton";
import GoogleAuthorizer from "@/components/molecules/GoogleAuthorizer";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  name: "Room",
  components: { GoogleAuthorizer, HaButton },
  created() {
    this.fetchRoomInfo();
  },
  methods: {
    async fetchRoomInfo() {
      const roomId = this.$route.params.room_id;
      const roomRef = firebase.firestore().collection("room");
      const docRef = roomRef.doc(roomId);
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error("no room found on server");
      }
      const room = doc.data();
      this.$store.dispatch("room/setRoom", { room });
    }
  },
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    },
    user() {
      return this.$store.getters["auth/me"];
    },
    room() {
      return this.$store.getters["room/info"];
    }
  },
  watch: {
    async authenticated(authenticated) {
      if (authenticated) {
        /* Googleの認証が有効になったら、userを作成/取得して登録 */
        const user = await FSUser.create();
        this.$store.dispatch("auth/logInAs", { user });
      }
    }
  }
};
</script>

<style scoped>

</style>