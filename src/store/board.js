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
    divisions(state, getters, rootState, rootGetters) {
      const boards = state.boards;
      const mapList = rootGetters["map/info"];
      const pawnList = rootGetters["pawn/info"];
      const divisions = [];
      for (let i = 0; i < boards.length; i++) {
        const b = boards[i];
        const pawns = pawnList.filter(p => p.board === b.id);
        const maps = mapList.filter(m => m.board === b.id);
        divisions.push({ id: b.id, pawns, maps });
      }

      return divisions;
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
