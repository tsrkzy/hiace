export const chat = {
  namespaced: true,
  state: {
    chats: []
  },
  mutations: {
    setChats(state, payload) {
      state.chats = payload.chats;
    }
  },
  actions: {
    setChats({ commit }, { chats }) {
      console.log("chat.setChats", chats); // @DELETEME
      commit("setChats", { chats });
    }
  },
  getters: {
    info(state) {
      return state.chats;
    }
  }
};
