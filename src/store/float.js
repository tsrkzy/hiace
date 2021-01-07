/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  IFFloat,
  CHAT_LIST,
  CHARACTER_LIST,
  UNSET,
  TABLE_VIEW,
  IMAGE_MANAGER,
  BOARD_LIST,
  ROOM_MANAGER
} from "@/interfaces/IFFloat";

export const float = {
  namespaced: true,
  state: {
    floats: [
      new IFFloat(ROOM_MANAGER, true),
      new IFFloat(BOARD_LIST, true),
      new IFFloat(CHARACTER_LIST, true),
      new IFFloat(CHAT_LIST, true)
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
      IFFloat.Pop(id);
    },
    sink(state, payload) {
      const { id } = payload;
      IFFloat.Sink(id);
    },
    create(state, payload) {
      const { contentId = UNSET, show = false, args } = payload;
      const float = new IFFloat(contentId, show, args);
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
    sink({ commit }, { id }) {
      commit("sink", { id });
    },
    create({ commit }, { contentId, show, args }) {
      commit("create", { contentId, show, args });
    },
    open({ commit }, { id }) {
      commit("setShow", { id, show: true });
    },
    close({ commit }, { id }) {
      commit("setShow", { id, show: false });
      commit("sink", { id });
    }
  },
  getters: {
    info(state) {
      return state.floats;
    },
    top(state) {
      const { floats = [] } = state;
      const shownFloats = floats.filter(f => f.show);
      if (shownFloats.length === 0) {
        return null;
      }
      return shownFloats.reduce((a, b) => (a.z > b.z ? a : b));
    }
  }
};
