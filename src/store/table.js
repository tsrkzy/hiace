export const table = {
  namespaced: true,
  state: {
    tables: []
  },
  mutations: {
    setTables(state, payload) {
      state.tables = payload.tables;
    }
  },
  actions: {
    setTables({ commit }, { tables }) {
      console.log("table.setTables", tables); // @DELETEME
      commit("setTables", { tables });
    }
  },
  getters: {
    info(state) {
      return state.tables;
    }
    // matrix(state) {
    //   const { tables = [] } = state;
    //   for (let i = 0; i < tables.length; i++) {
    //     let t = tables[i];
    //     const { columns = [], characters = [] } = t;
    //
    //   }
    // }
  }
};
