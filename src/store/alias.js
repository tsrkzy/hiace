export const alias = {
  namespaced: true,
  state: {
    aliases: []
  },
  mutations: {
    setAliases(state, payload) {
      state.aliases = payload.aliases;
    }
  },
  actions: {
    setAliases({ commit }, { aliases }) {
      console.log("alias.setAliases", aliases); // @DELETEME
      commit("setAliases", { aliases });
    }
  },
  getters: {
    info(state) {
      return state.aliases;
    },
    mine(state, getters, rootState, rootGetters) {
      const myCharacters = rootGetters["character/mine"];
      const myCharacterIds = myCharacters.map(c => c.id);
      return state.aliases.filter(
        c => myCharacterIds.indexOf(c.character) !== -1
      );
    }
  }
};
