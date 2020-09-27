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
    }
  }
};
