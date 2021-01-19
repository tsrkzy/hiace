export const chat = {
  namespaced: true,
  state: {
    chats: []
  },
  mutations: {
    setChats(state, payload) {
      state.chats = payload.chats;
    },
    addChat(state, payload) {
      state.chats.push(payload.chat);
    }
  },
  actions: {
    setChats({ commit }, { chats }) {
      console.log("chat.setChats", chats); // @DELETEME
      commit("setChats", { chats });
    },
    addChat({ commit }, { chat }) {
      console.log("chat.addChat", chat); // @DELETEME
      commit("addChat", { chat });
    }
  },
  getters: {
    info(state) {
      return state.chats;
    }
  }
};
