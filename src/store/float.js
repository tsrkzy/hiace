/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const float = {
  namespaced: true,
  state: {
    floats: [
      { id: 1, x: 100, y: 100, w: 200, h: 100 },
      { id: 2, x: 100, y: 100, w: 200, h: 100 },
      { id: 3, x: 100, y: 100, w: 200, h: 100 }
      // { id: 2, x: 0, y: 0, w: 100, h: 100 },
      // { id: 3, x: 0, y: 0, w: 100, h: 100 }
    ]
  },
  mutations: {
    setFloat(state, payload) {
      state.floats = payload.floats;
    },
    move(state, payload) {
      const { id, x = 0, y = 0 } = payload;
      const float = state.floats.find(f => f.id === id);
      if (!float) {
        throw new Error(`no float-window found: ${id}`);
      }
      float.x = x;
      float.y = y;
    },
    scale(state, payload) {
      const { id, w, h } = payload;
      const float = state.floats.find(f => f.id === id);
      if (!float) {
        throw new Error(`no float-window found: ${id}`);
      }
      float.w = w;
      float.h = h;
    }
  },
  actions: {
    setFloat({ commit }, { floats }) {
      commit("setFloat", { floats });
    },
    move({ commit }, { id, x, y }) {
      // console.log("float.move", id, x, y); // @DELETEME
      commit("move", { id, x, y });
    },
    scale({ commit }, { id, w, h }) {
      commit("scale", { id, w, h });
    }
  },
  getters: {
    info(state) {
      return state.floats;
    }
  }
};
