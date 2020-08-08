<template>
  <div>
    <div v-if="!loggedIn" id="firebaseui-auth-container"></div>
    <span v-if="loggedIn">ログイン中</span>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

/* initialize firebase UI widget */
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

export default {
  name: "GoogleAuthorizer",
  created() {
    const { currentUser } = firebase.auth();
    if (currentUser) {
      this.$store.dispatch("auth/logIn");
    }
  },
  mounted() {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());

    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: (/*authResult, redirectUrl*/) => {
          /* ログイン状態はfirebase.auth().currentUserが握るので、
           * ログイン後コールバックでは何もせずに終了 */
          this.$store.dispatch("auth/logIn");
          return false;
        }
      },
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      tosUrl: "/terms-of-service",
      privacyPolicyUrl: "/privacy-policy"
    });

  },
  methods: {
    logIn() {
      this.loggedIn = true;
    }
  },
  computed: {
    store_authLoggedIn() {
      return this.$store.getters["auth/loggedIn"];
    }
  },
  data() {
    return {
      loggedIn: false,
    };
  },
  watch: {
    store_authLoggedIn(loggedIn) {
      if (loggedIn) {
        this.logIn();
      }
    }
  }
};
</script>

<style scoped>

</style>