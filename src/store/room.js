export const KICKED = "KICKED";
export const JOINED = "JOINED";
export const WAITING = "WAITING";
export const NO_REQUEST = "NO_REQUEST";

export const room = {
  namespaced: true,
  state: {
    room: {
      id: null,
      owner: null,
      keepers: [],
      requests: [],
      kicked: [],
      users: [],
      characters: [],
      resources: [],
      gameSystem: null,
      initiative: null,
      activeBoard: null,
      maps: [],
      soundEffects: [],
      music: null
    },
    requests: []
  },
  mutations: {
    setRoom(state, payload) {
      state.room = payload.room;
    },
    setRequest(state, payload) {
      state.requests = payload.requests;
    }
  },
  actions: {
    setRoom({ commit }, { room = {} }) {
      console.log("room.setRoom", room); // @DELETEME
      commit("setRoom", { room });
    },
    leaveRoom({ commit }) {
      console.log("room.leaveRoom"); // @DELETEME
      const room = {
        id: null,
        owner: null,
        keepers: [],
        requests: [],
        kicked: [],
        users: [],
        characters: [],
        resources: [],
        gameSystem: null,
        initiative: null,
        activeMap: null,
        maps: [],
        soundEffects: [],
        music: null
      };
      commit("setRoom", { room });
    },
    setRequest({ commit }, { requests = [] }) {
      console.log("room.setRequest", requests); // @DELETEME
      commit("setRequest", { requests });
    }
  },
  getters: {
    info(state) {
      return state.room;
    },
    grant(state, getters, rootState, rootGetters) {
      const room = getters["info"];
      const user = rootGetters["auth/user"];

      const userId = user.id;
      const { kicked = [], requests = [], users = [] } = room;
      if (kicked.indexOf(userId) !== -1) {
        return { state: KICKED };
      }
      if (users.indexOf(userId) !== -1) {
        return { state: JOINED };
      }
      if (requests.indexOf(userId) !== -1) {
        return { state: WAITING };
      }
      return { state: NO_REQUEST };
    },
    music(state) {
      return state.room?.music ?? null;
    },
    activeBoard(state, getters) {
      return getters["info"]?.activeBoard;
    },
    requests(state) {
      return state.requests;
    },
    gameSystem(state){
      return state.system;
    }
  },
  modules: {}
};
