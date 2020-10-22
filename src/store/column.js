export const column = {
  namespaced: true,
  state: {
    columns: []
  },
  mutations: {
    setColumns(state, payload) {
      state.columns = payload.columns;
    }
  },
  actions: {
    setColumns({ commit }, { columns }) {
      console.log("column.setColumns", columns); // @DELETEME
      commit("setColumns", { columns });
    }
  },
  getters: {
    info(state) {
      return state.columns;
    }
  }
};
