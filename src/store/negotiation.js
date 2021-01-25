export const negotiation = {
  namespaced: true,
  state: {
    /*
     * id
     * createdAt
     * owner
     * room
     * sdp
     */
    node: null,
    /**
     * @type {Negotiation[]}
     */
    negotiations: [
      /*
       * class Negotiation
       * id
       * offer
       * offerNode
       * offerSDP
       * offerICE
       * answer
       * answerNode
       * answerSDP
       * answerICE
       * room
       * createdAt
       */
    ]
  },
  mutations: {
    setNode(state, payload) {
      state.node = payload.node;
    },
    setNegotiations(state, payload) {
      state.negotiations = payload.negotiations;
    },
    addNegotiations(state, payload) {
      state.negotiations.push(...payload.addNegotiations);
    },
    updateNegotiation(state, payload) {
      const u = payload.negotiation;
      const n = state.negotiations.find(n => n.id === u.id);
      if (!n) {
        console.error(`no negotiation found: ${u.id}`); // @DELETEME
        return;
      }
      n.offerSDP = u.offerSDP;
      n.offerICE = u.offerICE;
      n.answerSDP = u.answerSDP;
      n.answerICE = u.answerICE;
      n.phase = u.phase;
    }
  },
  actions: {
    setNode({ commit }, { node = {} }) {
      commit("setNode", { node });
    },
    setNegotiations({ commit }, { negotiations = {} }) {
      commit("setNegotiations", { negotiations });
    },
    addNegotiations({ commit }, { addNegotiations = [] }) {
      commit("addNegotiations", { addNegotiations });
    },
    updateNegotiation({ commit }, { negotiation }) {
      commit("updateNegotiation", { negotiation });
    }
  },
  getters: {
    node(state) {
      return state.node;
    },
    info(state) {
      return state.negotiations;
    }
  }
};
