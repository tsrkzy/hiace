<template>
  <div>
    <div v-if="!authenticated" id="firebaseui-auth-container"></div>
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
  created() {},
  mounted() {
    if (!this.authenticated) {
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebase.auth());
      ui.start("#firebaseui-auth-container", {
        callbacks: {
          signInSuccessWithAuthResult: (/*authResult, redirectUrl*/) => {
            this.syncAuthInfo();
            return false;
          }
        },
        signInFlow: "popup",
        signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
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
        this.$emit("authenticated");
      } else {
        this.$store.dispatch("auth/clearAuth");
        this.$emit("rejected");
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

<style scoped></style>
