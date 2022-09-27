/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

import {
  IFFloat,
  CHAT_LIST,
  // CHARACTER_LIST,
  UNSET,
  // TABLE_VIEW,
  // IMAGE_MANAGER,
  // BOARD_LIST,
  ROOM_MANAGER,
  ISSUE_WRITER,
} from "@/interfaces/IFFloat";

export const float = {
  namespaced: true,
  state: {
    floats: [
      /* IFFloat[] */
    ],
  },
  mutations: {
    initialize(state) {
      const importedList = IFFloat.Import();
      if (!importedList.length) {
        state.floats = [
          new IFFloat(ROOM_MANAGER, true),
          new IFFloat(CHAT_LIST, true),
          new IFFloat(ISSUE_WRITER, true),
        ];
      } else {
        if (!importedList.find((f) => f.contentId === ISSUE_WRITER)) {
          importedList.push(new IFFloat(ISSUE_WRITER, true));
        }
        state.floats = importedList;
      }
    },
    setFloat(state, payload) {
      state.floats = payload.floats;

      IFFloat.Export();
    },
    move(state, payload) {
      const { id, x = 0, y = 0 } = payload;
      const float = state.floats.find((f) => f.id === id);
      if (!float) {
        throw new Error(`no float-window found: ${id}`);
      }
      float.x = x;
      float.y = y;

      IFFloat.Export();
    },
    scale(state, payload) {
      const { id, w, h } = payload;
      const float = state.floats.find((f) => f.id === id);
      if (!float) {
        throw new Error(`no float-window found: ${id}`);
      }
      float.w = w;
      float.h = h;

      IFFloat.Export();
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
      /* singletonの場合はidが同じ */
      const index = state.floats.findIndex((f) => f.id === float.id);
      if (index !== -1) {
        state.floats[index].show = true;
        return false;
      }
      state.floats.push(float);

      IFFloat.Export();
    },
    setShow(state, payload) {
      const { id, show } = payload;
      console.log("float.setShow", id, show); // @DELETEME
      const float = state.floats.find((f) => f.id === id);
      float.show = show;
    },
    remove(state, payload) {
      const { contentId } = payload;
      const { floats = [] } = state;
      const result = [];
      for (let i = 0; i < floats.length; i++) {
        const float = floats[i];
        if (float.contentId === contentId) {
          float.dispose();
        } else {
          result.push(float);
        }
      }

      state.floats = result;

      IFFloat.Export();
    },
    reset(state) {
      IFFloat.Reset();
      IFFloat.Export();
    },
  },
  actions: {
    initialize({ commit }) {
      commit("initialize");
    },
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
    recreate({ commit }, { contentId, show, args }) {
      commit("remove", { contentId });
      commit("create", { contentId, show, args });
    },
    open({ commit }, { id }) {
      commit("setShow", { id, show: true });
    },
    close({ commit }, { id }) {
      commit("setShow", { id, show: false });
      commit("sink", { id });
    },
    reset({ commit }) {
      commit("reset");
    },
  },
  getters: {
    info(state) {
      return state.floats;
    },
    top(state) {
      const { floats = [] } = state;
      const shownFloats = floats.filter((f) => f.show);
      if (shownFloats.length === 0) {
        return null;
      }
      return shownFloats.reduce((a, b) => (a.z > b.z ? a : b));
    },
  },
};
