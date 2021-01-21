import { FSCharacter } from "@/collections/Character";

export const pawn = {
  namespaced: true,
  state: {
    pawns: [
      /* order by descendant of pawns.`updatedAt`.
       * @SEE collections/Pawn.ts#SetListener
       *  */
    ],
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
      const $elList = document.getElementsByClassName("__hide_on_drag");
      $elList.forEach($e => ($e.style.display = "none"));
      commit("setDrag", { drag: pawnId });
    },
    dragFinish({ commit }) {
      const $elList = document.getElementsByClassName("__hide_on_drag");
      $elList.forEach($e => ($e.style.display = ""));
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
    dragging(state) {
      return state.drag;
    },
    nameMap(state) {
      const nameMap = {};
      for (let i = 0; i < state.pawns.length; i++) {
        const id = state.pawns[i].id;
        const character = state.pawns[i].character;
        nameMap[id] = FSCharacter.Who(character);
      }
      return nameMap;
    }
  }
};
