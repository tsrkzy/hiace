/*-----------------------------------------------------------------------------
 - Copyright (c) 2021.                                                        -
 - @tsrkzy/Github.                                                            -
 - tsrmix@gmail.com                                                           -
 - All rights reserved.                                                       -
 -----------------------------------------------------------------------------*/
import {
  Negotiation,
  OFFER_SET_REMOTE_SDP,
  PeerConfig,
  SET_ANSWER_REMOTE_SDP,
  WAIT_FOR_REMOTE_ICE
} from "@/scripts/Peer";
import { FSNegotiation } from "@/collections/Negotiation";

export class AnswerPeer {
  id: string;
  _connection: RTCPeerConnection | null;
  _channel: RTCDataChannel | null;
  candidates: RTCIceCandidate[] = [];
  answerSDP: RTCSessionDescription | undefined;
  offerSDP: RTCSessionDescription | undefined;

  get connection() {
    if (!this._connection) {
      throw new Error("connection has not created yet");
    }
    return this._connection;
  }
  set connection(c) {
    this._connection = c;
  }
  get channel() {
    if (!this._channel) {
      throw new Error("channel has not created yet");
    }
    return this._channel;
  }
  set channel(c) {
    this._channel = c;
  }

  constructor(negotiationId: string) {
    console.log("AnswerPeer.constructor", negotiationId); // @DELETEME
    this._connection = null;
    this._channel = null;

    this.id = negotiationId;
    this.connection = this.createConnection();
  }

  dispose() {
    console.log("AnswerPeer.dispose");
    if (this.channel) {
      this.channel.onmessage = null;
      this.channel.onopen = null;
      this.channel.onerror = null;
      this.channel.onclose = null;
      this._channel = null;
    }
    if (this.connection) {
      this.connection.onicecandidate = null;
      this.connection.oniceconnectionstatechange = null;
      this._connection = null;
    }
  }

  createConnection() {
    const connection = new RTCPeerConnection(PeerConfig);
    connection.ondatachannel = this.ondatachannel.bind(this);
    connection.onicecandidate = this.onicecandidate.bind(this);
    connection.oniceconnectionstatechange = e => {
      const state = connection.iceConnectionState;
      console.log(`iceState: ${state}`); // @DELETEME
    };
    return connection;
  }

  ondatachannel(e: RTCDataChannelEvent) {
    this.channel = e.channel;
    this.channel.onmessage = this.onmessage.bind(this);
    this.channel.onopen = this.onopen.bind(this);
    this.channel.onerror = this.onerror.bind(this);
    this.channel.onclose = this.onclose.bind(this);
  }

  /* connection handler */
  async onicecandidate(e: RTCPeerConnectionIceEvent) {
    if (e.candidate) {
      const candidates = this.candidates;
      candidates.push(e.candidate);
    } else {
      const localICE = JSON.stringify({ candidates: this.candidates });
      await FSNegotiation.Update(this.id, {
        answerICE: localICE,
        phase: OFFER_SET_REMOTE_SDP
      });
    }
  }

  /* phases */
  async next(n: Negotiation) {
    const phase = n.toPhase();
    console.log(`AnswerPeer.next   phase -> ${phase}`); // @DELETEME
    switch (phase) {
      case SET_ANSWER_REMOTE_SDP: {
        const remoteSDP = JSON.parse(n.offerSDP ?? "");
        if (!remoteSDP) {
          throw new Error("invalid remoteSDP");
        }
        await this.setOffer(remoteSDP);
        const localSDP = await this.createAnswer();
        await this.setAnswer(localSDP);
        const answerSDP = JSON.stringify(localSDP);
        await FSNegotiation.Update(n.id, {
          answerSDP,
          phase: WAIT_FOR_REMOTE_ICE
        });
        break;
      }
    }
  }

  /* channel handler */
  onmessage(e: MessageEvent) {
    console.log("onmessage", e.data);
  }
  onopen() {
    this.channel?.send("answer: onopen");
    console.log("onopen");
  }
  onerror() {
    console.log("onerror");
  }
  onclose() {
    console.log("onclose");
    this.dispose();
  }

  async createAnswer(): Promise<RTCSessionDescription> {
    const answerSDP = await this.connection.createAnswer();
    return new RTCSessionDescription(answerSDP);
  }

  async setOffer(offerSDP: RTCSessionDescription) {
    this.offerSDP = offerSDP;
    await this.connection.setRemoteDescription(offerSDP);
  }

  async setAnswer(answerSDP: RTCSessionDescription) {
    this.answerSDP = answerSDP;
    await this.connection.setLocalDescription(answerSDP);
  }

  getCandidatesJSON() {
    return JSON.stringify({ candidates: this.candidates });
  }

  async setOpponentIceCandidates(candidates: RTCIceCandidateInit[]) {
    return Promise.all(
      candidates.map(candidate => {
        return this.connection.addIceCandidate(candidate);
      })
    ).catch(e => {
      console.error(e);
      return Promise.reject(e);
    });
  }

  ping() {
    if (!this.channel) {
      console.warn("channel has not created yet"); // @DELETEME
      return false;
    }
    console.log("answer.ping"); // @DELETEME
    this.channel.send("ping");
  }
}
