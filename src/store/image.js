export const image = {
  namespaced: true,
  state: {
    images: []
  },
  mutations: {
    setImages(state, payload) {
      state.images = payload.images;
    }
  },
  actions: {
    setImages({ commit }, { images }) {
      console.log("image.setImages", images); // @DELETEME
      commit("setImages", { images });
    }
  },
  getters: {
    info(state) {
      return state.images;
    },
    nameMap(state) {
      const nameMap = {};
      for (let i = 0; i < state.images.length; i++) {
        const id = state.images[i].id;
        const { owner = null } = state.images[i];
        nameMap[id] = owner;
      }
      return nameMap;
    }
  }
};
