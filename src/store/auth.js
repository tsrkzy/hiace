import "firebase/firestore";

export const auth = {
  namespaced: true,
  state: {
    /* firestore.auth */
    auth: {
      name: null,
      photoUrl: null,
      email: null
    },
    /* firestore.user */
    user: {
      id: null,
      name: null,
      photoUrl: null,
      email: null
    }
  },
  mutations: {
    setAuth(state, payload) {
      state.auth = payload.auth;
    },
    setUser(state, payload) {
      state.user = payload.user;
    }
  },
  actions: {
    setAuth({ commit }, { auth }) {
      console.log("auth.setAuth", auth); // @DELETEME
      commit("setAuth", { auth });
    },
    clearAuth({ commit }) {
      console.log("auth.clearAuth"); // @DELETEME
      const auth = {
        name: null,
        photoUrl: null,
        email: null
      };
      commit("setAuth", { auth });
    },
    logInAs({ commit }, { user }) {
      console.log("auth.logInAs", user); // @DELETEME
      commit("setUser", { user });
    },
    logOff({ commit }) {
      const user = {
        id: null,
        name: null,
        photoUrl: null,
        email: null
      };
      commit("setUser", { user });
    }
  },
  getters: {
    authenticated(state) {
      return !!state.auth.email;
    },
    loggedIn(state) {
      return !!state.user.id;
    },
    info(state){
      return state.auth;
    },
    me(state) {
      return state.user;
    }
  },
  modules: {}
};
