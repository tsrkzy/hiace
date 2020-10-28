export const pawn = {
  namespaced: true,
  state: {
    pawns: []
  },
  mutations: {
    setPawns(state, payload) {
      state.pawns = payload.pawns;
    },
    setTransform(state, { pawnId, transform }) {
      const pawn = state.pawns.find(p => p.id === pawnId);
      if (!pawn) {
        return false;
      }
      pawn.transform = transform;
    }
  },
  actions: {
    setPawns({ commit }, { pawns }) {
      console.log("pawn.setPawns", pawns); // @DELETEME
      commit("setPawns", { pawns });
    },
    updateTransform({ commit }, { pawnId, transform }) {
      console.log("pawn.updateTransform", pawnId, transform); // @DELETEME
      commit("setTransform", { pawnId, transform });
    },
    resetTrasform({ commit }, { pawnId }) {
      console.log("pawn.resetTrasform", pawnId); // @DELETEME
      commit("setTransform", { pawnId, transform: `${new DOMMatrix()}` });
    }
  },
  getters: {
    info(state) {
      return state.pawns;
    }
  }
};
