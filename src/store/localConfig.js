const { maskChannel: initialMaskChannel = false } = JSON.parse(
  window.localStorage.getItem("localConfig") ?? "{}"
);
console.log("localConfig.maskChannel", initialMaskChannel);

export const localConfig = {
  namespaced: true,
  state: {
    maskChannel: initialMaskChannel
  },
  mutations: {
    setMaskChannel(state, payload) {
      state.maskChannel = payload.maskChannel;
      const lc = JSON.parse(window.localStorage.getItem("localConfig") || "{}");
      lc.maskChannel = payload.maskChannel;
      window.localStorage.setItem("localConfig", JSON.stringify(lc));
    }
  },
  actions: {
    setMaskChannel({ commit }, { maskChannel = false }) {
      commit("setMaskChannel", { maskChannel });
    }
  },
  getters: {
    maskChannel(state) {
      return state.maskChannel;
    }
  }
};
