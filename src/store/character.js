import { CHARACTER_NOT_SELECTED } from "@/collections/Character";

export const character = {
  namespaced: true,
  state: {
    characters: [],
    activeCharacterId: CHARACTER_NOT_SELECTED
  },
  mutations: {
    setCharacters(state, payload) {
      state.characters = payload.characters;
    },
    select(state, payload) {
      state.activeCharacterId = payload.characterId;
    }
  },
  actions: {
    setCharacters({ commit }, { characters }) {
      console.log("character.setCharacters", characters); // @DELETEME
      commit("setCharacters", { characters });
    },
    select({ commit }, { characterId }) {
      console.log("character.select"); // @DELETEME
      commit("select", { characterId });
    }
  },
  getters: {
    info(state) {
      return state.characters;
    },
    activeId(state) {
      return state.activeCharacterId;
    },
    active(state) {
      return state.characters.find(c => c.id === state.activeCharacterId);
    }
  }
};
