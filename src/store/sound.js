/*-----------------------------------------------------------------------------
 - Copyright (c) 2020.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/

export const sound = {
  namespaced: true,
  state: {
    sounds: []
  },
  mutations: {
    setSounds(state, payload) {
      state.sounds = payload.sounds;
    }
  },
  actions: {
    setSounds({ commit }, { sounds }) {
      console.log("sound.setSounds", sounds); // @DELETEME
      commit("setSounds", { sounds });
    }
  },
  getters: {
    info(state) {
      return state.sounds;
    }
  }
};
