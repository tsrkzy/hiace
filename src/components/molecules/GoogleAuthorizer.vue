<template>
  <div>
    <div v-if="!authenticated" id="firebaseui-auth-container"></div>
    <!--    <div v-if="authenticated">-->
    <!--      <h5>auth.info</h5>-->
    <!--      <pre>{{ $store.getters["auth/info"] }}</pre>-->
    <!--    </div>-->
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

  },
  mounted() {
    if (!this.authenticated) {
      const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", {
        callbacks: {
          signInSuccessWithAuthResult: (/*authResult, redirectUrl*/) => {
            this.syncAuthInfo();
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
    }

  },
  methods: {
    syncAuthInfo() {
      const { currentUser } = firebase.auth();
      if (currentUser) {
        const auth = {
          name: currentUser.displayName,
          photoUrl: currentUser.photoURL,
          email: currentUser.email
        };
        this.$store.dispatch("auth/setAuth", { auth });
      } else {
        this.$store.dispatch("auth/clearAuth");
      }
    }
  },
  computed: {
    authenticated() {
      return this.$store.getters["auth/authenticated"];
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>

</style>