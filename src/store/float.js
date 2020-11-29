/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import { FloatContent, IFFloat } from "@/interfaces/IFFloat";

export const float = {
  namespaced: true,
  state: {
    floats: [
      new IFFloat(FloatContent.CHAT_LIST),
      new IFFloat(FloatContent.CHAT_LIST),
      new IFFloat(FloatContent.CHARACTER_LIST, true),
      new IFFloat(FloatContent.ERROR, true)
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
    },
    pop(state, payload) {
      const { id } = payload;
      const floats = state.floats.slice();
      const index = floats.findIndex(f => f.id === id);
      const pop = floats.splice(index, 1);
      state.floats = [].concat(floats, pop);
    },
    create(state, payload) {
      const { contentId = 0, show = false } = payload;
      const float = new IFFloat(contentId, show);
      state.floats.push(float);
    },
    setShow(state, payload) {
      const { id, show } = payload;
      console.log("float.setShow", id, show); // @DELETEME
      const float = state.floats.find(f => f.id === id);
      float.show = show;
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
    },
    pop({ commit }, { id }) {
      commit("pop", { id });
    },
    create({ commit }, { contentId, show }) {
      commit("create", { contentId, show });
    },
    open({ commit }, { id }) {
      commit("setShow", { id, show: true });
    },
    close({ commit }, { id }) {
      commit("setShow", { id, show: false });
    }
  },
  getters: {
    info(state) {
      return state.floats;
    },
    top(state) {
      const { floats = [] } = state;
      if (floats.length === 0) {
        return null;
      }
      return floats[floats.length - 1];
    }
  }
};
