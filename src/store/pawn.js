export const pawn = {
  namespaced: true,
  state: {
    pawns: [],
    drag: null
  },
  mutations: {
    setPawns(state, payload) {
      state.pawns = payload.pawns;
    },
    setDrag(state, payload) {
      state.drag = payload.drag;
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
    dragStart({ commit }, { pawnId }) {
      commit("setDrag", { drag: pawnId });
    },
    dragFinish({ commit }) {
      commit("setDrag", { drag: null });
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
    },
    dragging(state){
      return state.drag;
    }
  }
};
