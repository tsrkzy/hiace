/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const contextmenu = {
  namespaced: true,
  state: {
    /* 表示 */
    show: false,

    /* ネストした項目の展開状態 */
    open: null,

    itemGroups: []
  },
  mutations: {
    setShow(state, { show }) {
      state.show = show;
    },
    setOpen(state, { open }) {
      state.open = open;
    },
    setItemGroups(state, { itemGroups = [] }) {
      state.itemGroups = itemGroups;
    }
  },
  actions: {
    open({ commit }, { open }) {
      console.log("contextmenu.open", open); // @DELETEME
      commit("setOpen", { open });
    },
    on({ commit }, { itemGroups = [] } = {}) {
      console.log("contextmenu.on"); // @DELETEME
      commit("setItemGroups", { itemGroups });
      commit("setShow", { show: true });
    },
    off({ commit }) {
      console.log("contextmenu.off"); // @DELETEME
      commit("setShow", { show: false });
      commit("setOpen", { open: null });
    }
  },
  getters: {
    show(state) {
      return state.show;
    },
    open(state) {
      return state.open;
    }
  }
};
