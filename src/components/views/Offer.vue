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
      <button @click="offer">offer</button>
    </div>
    <div>
      <textarea placeholder="answerSDP" v-model="answerSDP"></textarea>
      <button @click="receiveAnswer">receiveAnswer</button>
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
import { OfferPeer } from "@/scripts/OfferPeer";

export default {
  name: "Offer",
  created() {
    this.peer = new OfferPeer();
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
    async offer() {
      /* offer側のSDP作成 */
      const sdp = await this.peer.createOffer();
      /* offer側localのdescription読み込み */
      await this.peer.setOffer(sdp);

      this.offerSDP = JSON.stringify(sdp);
    },
    async receiveAnswer() {
      const answerSDP = JSON.parse(this.answerSDP);
      console.log("Offer.receiveAnswer"); // @DELETEME
      await this.peer.setAnswer(new RTCSessionDescription(answerSDP));
      this.setMyCandidates();
    },
    setMyCandidates() {
      console.log("Offer.setMyCandidates"); // @DELETEME
      this.myCandidates = this.peer.getCandidatesJSON();
    },
    async setCandidates() {
      const { candidates } = JSON.parse(this.candidates);
      await this.peer.setOpponentIceCandidates(candidates);
    },
    ping() {
      this.peer.ping();
    }
  }
};
</script>

<style scoped></style>
