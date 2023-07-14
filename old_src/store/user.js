import { extractAccountFromEmail } from "@/scripts/helper";

export const user = {
  namespaced: true,
  state: {
    users: [],
  },
  mutations: {
    setUsers(state, payload) {
      state.users = payload.users;
    },
  },
  actions: {
    setUsers({ commit }, { users }) {
      console.log("user.setUsers", users); // @DELETEME
      commit("setUsers", { users });
    },
  },
  getters: {
    info(state) {
      return state.users;
    },
    nameMap(state) {
      const nameMap = {};
      for (let i = 0; i < state.users.length; i++) {
        const id = state.users[i].id;
        const email = state.users[i].email;
        nameMap[id] = extractAccountFromEmail(email);
      }
      return nameMap;
    },
  },
};
