export const alias = {
  namespaced: true,
  state: {
    aliases: [],
  },
  mutations: {
    setAliases(state, payload) {
      state.aliases = payload.aliases;
    },
  },
  actions: {
    setAliases({ commit }, { aliases }) {
      console.log("alias.setAliases"); // @DELETEME
      commit("setAliases", { aliases });
    }
  },
  getters: {
    info(state) {
      return state.aliases;
    }
  }
};