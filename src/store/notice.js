/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const notice = {
  namespaced: true,
  state: {
    notices: [],
  },
  mutations: {
    addNotices(state, { notice }) {
      state.notices.push(notice);
    },
    deleteNotice(state, { id }) {
      const { notices = [] } = state;
      const index = notices.findIndex((n) => n.id === id);
      if (index === -1) {
        return false;
      }
      notices.splice(index, 1);
    },
  },
  actions: {
    add({ commit }, { notice }) {
      commit("addNotices", { notice });
    },
    delete({ commit }, { id }) {
      commit("deleteNotice", { id });
    },
  },
  getters: {
    info(state) {
      return state.notices;
    },
  },
};
