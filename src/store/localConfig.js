const {
  maskChannel: initialMaskChannel = false,
  hideChannel: initialHideChannel = false
} = JSON.parse(window.localStorage.getItem("localConfig") ?? "{}");
console.log("localConfig.maskChannel", initialMaskChannel);
console.log("localConfig.hideChannel", initialHideChannel);

export const localConfig = {
  namespaced: true,
  state: {
    maskChannel: initialMaskChannel,
    hideChannel: initialHideChannel
  },
  mutations: {
    setMaskChannel(state, payload) {
      state.maskChannel = payload.maskChannel;
      const lc = JSON.parse(window.localStorage.getItem("localConfig") || "{}");
      lc.maskChannel = payload.maskChannel;
      window.localStorage.setItem("localConfig", JSON.stringify(lc));
    },
    setHideChannel(state, payload) {
      state.hideChannel = payload.hideChannel;
      const lc = JSON.parse(window.localStorage.getItem("localConfig") || "{}");
      lc.hideChannel = payload.hideChannel;
      window.localStorage.setItem("localConfig", JSON.stringify(lc));
    }
  },
  actions: {
    setMaskChannel({ commit }, { maskChannel = false }) {
      commit("setMaskChannel", { maskChannel });
    },
    setHideChannel({ commit }, { hideChannel = false }) {
      commit("setHideChannel", { hideChannel });
    }
  },
  getters: {
    maskChannel(state) {
      return state.maskChannel;
    },
    hideChannel(state) {
      return state.hideChannel;
    }
  }
};
