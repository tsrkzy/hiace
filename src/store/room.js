import "firebase/firestore";

export const room = {
  namespaced: true,
  state: {
    room: {
      owner: null,
      keepers: [],
      requests: [],
      kicked: [],
      users: [],
      characters: [],
      logs: [],
      resources: [],
      gameSystem: "cthuluhu",
      initiative: null,
      activeMap: null,
      maps: [],
      soundEffects: [],
      musics: null,
    }
  },
  mutations: {
    setRoom(state, payload) {
      state.room = payload.room;
    }
  },
  actions: {
    setRoom({ commit }, { room = {} }) {
      console.log("room.setRoom", room); // @DELETEME
      commit("setRoom", { room });
    }
  },
  getters: {
    info(state) {
      return state.room;
    },
  },
  modules: {}
};
