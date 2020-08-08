export const auth = {
  namespaced: true,
  state: {
    loggedIn: false
  },
  mutations: {
    setLoggedIn(state, payload) {
      state.loggedIn = payload.loggedIn;
    }
  },
  actions: {
    logIn({ commit }) {
      console.log("auth.logIn"); // @DELETEME
      commit("setLoggedIn", { loggedIn: true });
    },
    logOff({ commit }) {
      console.log("auth.logOff"); // @DELETEME
      commit("setLoggedIn", { loggedIn: false });
    },
  },
  getters: {
    loggedIn(state) {
      return state.loggedIn;
    }
  },
  modules: {}
};