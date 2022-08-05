export const dice = {
  namespaced: true,
  state: {
    dices: [
      /* order by descendant of dices.`updatedAt`.
       * @SEE collections/Dice.ts#SetListener
       *  */
    ],
    drag: null
  },
  mutations: {
    setDices(state, payload) {
      state.dices = payload.dices;
    },
    setDrag(state, payload) {
      state.drag = payload.drag;
    },
    setTransform(state, { diceId, transform }) {
      const dice = state.dices.find(p => p.id === diceId);
      if (!dice) {
        return false;
      }
      dice.transform = transform;
    }
  },
  actions: {
    setDices({ commit }, { dices }) {
      console.log("dice.setDices", dices); // @DELETEME
      commit("setDices", { dices });
    },
    dragStart({ commit }, { diceId }) {
      const $elList = document.getElementsByClassName("__hide_on_drag");
      Array.prototype.forEach.call($elList, $e => ($e.style.display = "none"));
      commit("setDrag", { drag: diceId });
    },
    dragFinish({ commit }) {
      const $elList = document.getElementsByClassName("__hide_on_drag");
      Array.prototype.forEach.call($elList, $e => ($e.style.display = ""));
      commit("setDrag", { drag: null });
    },
    updateTransform({ commit }, { diceId, transform }) {
      console.log("dice.updateTransform", diceId, transform); // @DELETEME
      commit("setTransform", { diceId, transform });
    },
    resetTrasform({ commit }, { diceId }) {
      console.log("dice.resetTrasform", diceId); // @DELETEME
      commit("setTransform", { diceId, transform: `${new DOMMatrix()}` });
    }
  },
  getters: {
    info(state) {
      return state.dices;
    },
    dragging(state) {
      return state.drag;
    }
  }
};
