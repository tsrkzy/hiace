export const character = {
  namespaced: true,
  state: {
    characters: [],
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
    }
  }
};