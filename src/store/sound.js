/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const sound = {
  namespaced: true,
  state: {
    sounds: [],

    /* グローバルミュート */
    mute: false
  },
  mutations: {
    setSounds(state, payload) {
      state.sounds = payload.sounds;
    },
    setMute(state, payload) {
      state.mute = payload.mute;
    }
  },
  actions: {
    setSounds({ commit }, { sounds }) {
      console.log("sound.setSounds", sounds); // @DELETEME
      commit("setSounds", { sounds });
    },
    globalMute({ commit }) {
      console.log("sound.globalMute"); // @DELETEME
      commit("setMute", { mute: true });
    },
    globalUnMute({ commit }) {
      console.log("sound.globalUnMute"); // @DELETEME
      commit("setMute", { mute: false });
    }
  },
  getters: {
    info(state) {
      return state.sounds;
    }
  }
};
