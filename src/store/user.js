export const user = {
  namespaced: true,
  state: {
    users: []
  },
  mutations: {
    setUsers(state, payload) {
      state.users = payload.users;
    }
  },
  actions: {
    setUsers({ commit }, { users }) {
      console.log("user.setUsers", users); // @DELETEME
      commit("setUsers", { users });
    }
  },
  getters: {
    info(state) {
      return state.users;
    }
  }
};
