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
    mute: false,
    playing: null
  },
  mutations: {
    setSounds(state, payload) {
      state.sounds = payload.sounds;
    },
    setMute(state, payload) {
      state.mute = payload.mute;
    },
    setPlaying(state, payload) {
      console.warn("sound.setPlaying", payload.playing);
      state.playing = payload.playing;
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
    },
    setPlaying({ commit }, { playing }) {
      console.log("sound.setPlaying"); // @DELETEME
      commit("setPlaying", { playing });
    },
    unsetPlaying({ commit }) {
      console.log("sound.unsetPlaying"); // @DELETEME
      commit("setPlaying", { playing: null });
    }
  },
  getters: {
    info(state) {
      return state.sounds;
    },
    playing(state) {
      return state.playing;
    },
    nameMap(state) {
      const nameMap = {};
      for (let i = 0; i < state.sounds.length; i++) {
        const id = state.sounds[i].id;
        nameMap[id] = state.sounds[i].name;
      }
      return nameMap;
    }
  }
};
