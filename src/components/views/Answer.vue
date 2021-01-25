<!-----------------------------------------------------------------------------
  - Copyright (c) 2021.                                                       -
  - @tsrkzy/Github.                                                           -
  - tsrmix@gmail.com                                                          -
  - All rights reserved.                                                      -
  ----------------------------------------------------------------------------->

<template>
  <div>
    <div>
      <textarea placeholder="offerSDP" v-model="offerSDP"></textarea>
    </div>
    <div>
      <textarea placeholder="answerSDP" v-model="answerSDP"></textarea>
      <button @click="answer">answer</button>
    </div>
    <div>
      <textarea placeholder="myCandidates" v-model="myCandidates"></textarea>
      <textarea placeholder="candidates" v-model="candidates"></textarea>
      <div>
        <button @click="setMyCandidates">setMyCandidates</button>
        <button @click="setCandidates">setCandidates</button>
        <button @click="ping">ping</button>
      </div>
    </div>
  </div>
</template>

<script>
import { AnswerPeer } from "@/scripts/AnswerPeer";

export default {
  name: "Answer",
  created() {
    this.peer = new AnswerPeer();
  },
  data() {
    return {
      peer: null,
      offerSDP: null,
      answerSDP: null,
      myCandidates: null,
      candidates: null
    };
  },
  methods: {
    async answer() {
      console.log("answer"); // @DELETEME
      const offerSDPInit = JSON.parse(this.offerSDP);
      await this.peer.setOffer(new RTCSessionDescription(offerSDPInit));

      const answerSDP = await this.peer.createAnswer();
      await this.peer.setAnswer(answerSDP);

      this.answerSDP = JSON.stringify(answerSDP);
    },
    setMyCandidates() {
      /* should be after onicecandidate */
      console.log("Answer.setMyCandidates"); // @DELETEME
      this.myCandidates = this.peer.getCandidatesJSON();
    },
    async setCandidates() {
      console.log("Answer.setCandidates"); // @DELETEME
      const { candidates } = JSON.parse(this.candidates);
      await this.peer.setOpponentIceCandidates(candidates);
      console.log("done!"); // @DELETEME
    },
    ping() {
      this.peer.ping();
    }
  }
};
</script>

<style scoped></style>
