/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const smoke = {
  namespaced: true,
  state: {
    show: false
  },
  mutations: {
    setShow(state, { show }) {
      state.show = show;
    }
  },
  actions: {
    on({ commit }) {
      console.log("smoke.on"); // @DELETEME
      commit("setShow", { show: true });
    },
    off({ commit }) {
      console.log("smoke.off"); // @DELETEME
      commit("setShow", { show: false });
    }
  },
  getters: {
    show(state) {
      return state.show;
    }
  }
};
