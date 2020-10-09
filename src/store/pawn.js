export const pawn = {
  namespaced: true,
  state: {
    pawns: []
  },
  mutations: {
    setPawns(state, payload) {
      state.pawns = payload.pawns;
    }
  },
  actions: {
    setPawns({ commit }, { pawns }) {
      console.log("pawn.setPawns", pawns); // @DELETEME
      commit("setPawns", { pawns });
    }
  },
  getters: {
    info(state) {
      return state.pawns;
    }
  }
};
