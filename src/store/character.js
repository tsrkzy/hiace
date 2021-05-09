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
      const characters = state.characters.filter(c => c.owner === myUserId);
      return characters.sort((a, b) => {
        const { name: nA } = a;
        const { name: nB } = b;
        return nA > nB ? 1 : -1;
      });
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
