const {
  maskChannel: initialMaskChannel = false,
  ring: initialRing = true
} = JSON.parse(window.localStorage.getItem("localConfig") ?? "{}");
console.log("localConfig.maskChannel", initialMaskChannel);
console.log("localConfig.ring", initialRing);

export const localConfig = {
  namespaced: true,
  state: {
    maskChannel: initialMaskChannel,
    ring: initialRing
  },
  mutations: {
    setMaskChannel(state, payload) {
      state.maskChannel = payload.maskChannel;
      const lc = JSON.parse(window.localStorage.getItem("localConfig") || "{}");
      lc.maskChannel = payload.maskChannel;
      window.localStorage.setItem("localConfig", JSON.stringify(lc));
    },
    setRing(state, payload) {
      state.ring = payload.ring;
      const lc = JSON.parse(window.localStorage.getItem("localConfig") || "{}");
      lc.ring = payload.ring;
      window.localStorage.setItem("localConfig", JSON.stringify(lc));
    }
  },
  actions: {
    setMaskChannel({ commit }, { maskChannel = false }) {
      commit("setMaskChannel", { maskChannel });
    },
    setRing({ commit }, { ring = false }) {
      commit("setRing", { ring });
    }
  },
  getters: {
    maskChannel(state) {
      return state.maskChannel;
    },
    ring(state) {
      return state.ring;
    }
  }
};
