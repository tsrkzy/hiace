export const detail = {
  namespaced: true,
  state: {
    text: "",
    side: "left",
    show: false
  },
  mutations: {
    setSide(state, payload) {
      state.side = payload.side;
    },
    setText(state, payload) {
      state.text = payload.text;
    },
    setShow(state, payload) {
      state.show = payload.show;
    }
  },
  actions: {
    setContent({ commit }, { text = "", side = "left" }) {
      commit("setSide", { side });
      commit("setText", { text });
      commit("setShow", { show: true });
    },
    off({ commit }) {
      commit("setText", { text: "" });
      commit("setShow", { show: false });
    }
  },
  getters: {
    leftSide(state) {
      return state.side === "left";
    },
    lines(state) {
      return state.text.split(/\n/);
    },
    show(state) {
      return state.show;
    }
  }
};
