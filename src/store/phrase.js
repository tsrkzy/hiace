export const phrase = {
  namespaced: true,
  state: {
    phrases: []
  },
  mutations: {
    setPhrases(state, payload) {
      state.phrases = payload.phrases;
    }
  },
  actions: {
    setPhrases({ commit }, { phrases }) {
      console.log("phrase.setPhrases", phrases); // @DELETEME
      commit("setPhrases", { phrases });
    }
  },
  getters: {
    info(state) {
      return state.phrases;
    }
  }
};
