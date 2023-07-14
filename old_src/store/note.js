export const note = {
  namespaced: true,
  state: {
    notes: [],
  },
  mutations: {
    setNotes(state, payload) {
      state.notes = payload.notes;
    },
    addNote(state, payload) {
      state.notes.push(payload.note);
    },
  },
  actions: {
    setNotes({ commit }, { notes }) {
      console.log("note.setNotes", notes); // @DELETEME
      commit("setNotes", { notes });
    },
    addNote({ commit }, { note }) {
      console.log("note.addNote"); // @DELETEME
      commit("addNote", { note });
    },
  },
  getters: {
    info(state) {
      return state.notes;
    },
    nameMap(state) {
      const nameMap = {};
      for (let i = 0; i < state.notes.length; i++) {
        const id = state.notes[i].id;
        nameMap[id] = state.notes[i].name;
      }
      return nameMap;
    },
  },
};
