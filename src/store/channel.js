export const channel = {
  namespaced: true,
  state: {
    channels: [],
  },
  mutations: {
    setChannels(state, payload) {
      state.channels = payload.channels;
    },
  },
  actions: {
    setChannels({ commit }, { channels }) {
      console.log("channel.setChannels", channels); // @DELETEME
      commit("setChannels", { channels });
    }
  },
  getters: {
    info(state) {
      return state.channels;
    }
  },
};