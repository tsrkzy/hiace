import { CHARACTER_NOT_SELECTED } from "@/collections/Character";

export const character = {
  namespaced: true,
  state: {
    characters: [],
    /** @deprecated コンポーネントが保持するべき */
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
    mine(state, getters, rootState, rootGetters) {
      const myUserId = rootGetters["auth/user"]?.id;
      return state.characters.filter(c => c.owner === myUserId);
    },
    tree(state, getters, rootState, rootGetters) {
      const { characters = [] } = state;
      const aliases = rootGetters["alias/mine"];
      const tree = {};
      for (let i = 0; i < characters.length; i++) {
        const c = characters[i];
        c.aliases = {};
        tree[c.id] = c;
        for (let j = 0; j < aliases.length; j++) {
          const a = aliases[j];
          if (c.id === a.character) {
            c.aliases[a.id] = a;
            aliases.splice(j, 1);
            j--;
            continue;
          }
        }
      }
      return tree;
    },
    /** @deprecated コンポーネントが保持するべき */
    activeId(state) {
      return state.activeCharacterId;
    },
    /** @deprecated コンポーネントが保持するべき */
    active(state) {
      return state.characters.find(c => c.id === state.activeCharacterId);
    }
  }
};
