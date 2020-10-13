export const board = {
  namespaced: true,
  state: {
    boards: []
  },
  mutations: {
    setBoards(state, payload) {
      state.boards = payload.boards;
    }
  },
  actions: {
    setBoards({ commit }, { boards }) {
      console.log("board.setBoards", boards); // @DELETEME
      commit("setBoards", { boards });
    }
  },
  getters: {
    info(state) {
      return state.boards;
    },
    active(state, getters, rootStore, rootGetters) {
      const { activeBoard } = rootGetters["room/info"];
      if (!activeBoard) {
        return null;
      }
      return state.boards.find(b => b.id === activeBoard);
    }
  }
};
