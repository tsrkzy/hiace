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
      return state.columns.slice().sort((a, b) => (a.order > b.order ? 1 : -1));
    },
    nameMap(state) {
      const nameMap = {};
      for (let i = 0; i < state.columns.length; i++) {
        const id = state.columns[i].id;
        nameMap[id] = state.columns[i].label;
      }
      return nameMap;
    }
  }
};
