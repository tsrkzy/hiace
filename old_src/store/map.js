export const map = {
  namespaced: true,
  state: {
    maps: [],
    drag: null,
  },
  mutations: {
    setMaps(state, payload) {
      state.maps = payload.maps;
    },
    setDrag(state, payload) {
      state.drag = payload.drag;
    },
    setTransform(state, { mapId, transform }) {
      const map = state.maps.find((m) => m.id === mapId);
      if (!map) {
        return false;
      }
      map.transform = transform;
    },
  },
  actions: {
    setMaps({ commit }, { maps }) {
      console.log("map.setMaps", maps); // @DELETEME
      commit("setMaps", { maps });
    },
    dragStart({ commit }, { mapId }) {
      const $elList = document.getElementsByClassName("__hide_on_drag");
      Array.prototype.forEach.call(
        $elList,
        ($e) => ($e.style.display = "none")
      );
      commit("setDrag", { drag: mapId });
    },
    dragFinish({ commit }) {
      const $elList = document.getElementsByClassName("__hide_on_drag");
      Array.prototype.forEach.call($elList, ($e) => ($e.style.display = ""));
      commit("setDrag", { drag: null });
    },
    updateTransform({ commit }, { mapId, transform }) {
      console.log("map.updateTransform", mapId, transform); // @DELETEME
      commit("setTransform", { mapId, transform });
    },
    resetTrasform({ commit }, { mapId }) {
      console.log("map.resetTrasform", mapId); // @DELETEME
      commit("setTransform", { mapId, transform: `${new DOMMatrix()}` });
    },
  },
  getters: {
    info(state) {
      return state.maps;
    },
    dragging(state) {
      return state.drag;
    },
  },
};
