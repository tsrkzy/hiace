export const channel = {
  namespaced: true,
  state: {
    channels: []
  },
  mutations: {
    setChannels(state, payload) {
      state.channels = payload.channels;
    },
    addChannel(state, payload) {
      state.channels.push(payload.channel);
    }
  },
  actions: {
    setChannels({ commit }, { channels }) {
      console.log("channel.setChannels", channels); // @DELETEME
      commit("setChannels", { channels });
    },
    addChannel({ commit }, { channel }) {
      console.log("channel.addChannel"); // @DELETEME
      commit("addChannel", { channel });
    }
  },
  getters: {
    info(state) {
      return state.channels;
    }
  }
};
