export const arrow = {
  namespaced: true,
  state: {
    arrows: [],
  },
  mutations: {
    setArrows(state, payload) {
      state.arrows = payload.arrows;
    },
  },
  actions: {
    setArrows({ commit }, { arrows }) {
      console.log("arrow.setArrows", arrows); // @DELETEME
      commit("setArrows", { arrows });
    },
  },
  getters: {
    info(state) {
      return state.arrows;
    },
  },
};
