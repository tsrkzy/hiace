export const map = {
  namespaced: true,
  state: {
    maps: []
  },
  mutations: {
    setMaps(state, payload) {
      state.maps = payload.maps;
    }
  },
  actions: {
    setMaps({ commit }, { maps }) {
      console.log("map.setMaps", maps); // @DELETEME
      commit("setMaps", { maps });
    }
  },
  getters: {
    info(state) {
      return state.maps;
    }
  }
};
