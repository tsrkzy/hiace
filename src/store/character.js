export const character = {
  namespaced: true,
  state: {
    characters: []
  },
  mutations: {
    setCharacters(state, payload) {
      state.characters = payload.characters;
    }
  },
  actions: {
    setCharacters({ commit }, { characters }) {
      console.log("character.setCharacters", characters); // @DELETEME
      commit("setCharacters", { characters });
    }
  },
  getters: {
    info(state) {
      return state.characters;
    },
    mine(state, getters, rootState, rootGetters) {
      const myUserId = rootGetters["auth/user"]?.id;
      return state.characters.filter(c => c.owner === myUserId);
    },
    nameMap(state) {
      const nameMap = {};
      for (let i = 0; i < state.characters.length; i++) {
        const id = state.characters[i].id;
        nameMap[id] = state.characters[i].name;
      }
      return nameMap;
    }
  }
};
